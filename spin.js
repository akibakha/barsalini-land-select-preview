/* A photographic frame viewer. The object itself is never rotated with CSS. */
(() => {
  'use strict';

  const models = {
    forma: 'Forma', sera: 'Sera', linea: 'Linea', luna: 'Luna', piega: 'Piega',
    volume: 'Volume', riva: 'Riva', amuleto: 'Amuleto', cilindro: 'Cilindro', velour: 'Velour'
  };
  const photoViews = [
    ['front', 'Спереди'], ['back', 'Сзади'], ['side', 'Сбоку'],
    ['inside', 'Внутри'], ['detail', 'Детали'], ['top', 'Верх и застёжка']
  ];
  const cache = new Map();
  const pointers = new Map();
  let dialog, ui, current, returnFocus, originatingDialog;
  let gesture = null;
  let isClosing = false;

  function resources(id, mode) {
    const key = `${id}:${mode}`;
    if (!cache.has(key)) {
      const items = mode === 'photos'
        ? photoViews.map(([view, label]) => ({src: `assets/velour-${view}.webp`, label}))
        : Array.from({length: 8}, (_, index) => ({
          src: `assets/spin/${id}/${String(index + 1).padStart(2, '0')}.webp`,
          label: `Ракурс ${index * 45}°`
        }));
      cache.set(key, {items: items.map(item => ({...item, state: 'idle'}))});
    }
    return cache.get(key);
  }

  function makeDialog() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.id = 'spinDialog';
    dialog.className = 'spin-dialog';
    dialog.setAttribute('aria-labelledby', 'spinTitle');
    dialog.setAttribute('aria-describedby', 'spinSource spinHint');
    dialog.innerHTML = `
      <div class="spin-header">
        <div><p class="eyebrow">COLLECTION PREMIÈRE</p><h2 id="spinTitle"></h2></div>
        <button type="button" class="close spin-close" aria-label="Закрыть обзор">×</button>
      </div>
      <div class="spin-mode-row">
        <div class="spin-modes" role="group" aria-label="Режим просмотра">
          <button type="button" data-spin-mode="spin" aria-pressed="true">Вращение 360°</button>
          <button type="button" data-spin-mode="photos" aria-pressed="false">Фотографии</button>
        </div>
        <p id="spinSource" class="spin-source">Визуализация формы · AI</p>
      </div>
      <div class="spin-viewport" tabindex="0" role="group" aria-label="Изображение сумки. Стрелки влево и вправо меняют ракурс, плюс и минус меняют масштаб.">
        <img class="spin-image" draggable="false" alt="">
        <div class="spin-empty" hidden><span>Изображение пока недоступно</span></div>
        <div class="spin-loading" role="status"><span class="spin-loading-dot"></span><span>Загружаем ракурсы…</span></div>
        <button type="button" class="spin-arrow spin-prev" aria-label="Предыдущий ракурс">←</button>
        <button type="button" class="spin-arrow spin-next" aria-label="Следующий ракурс">→</button>
        <span class="spin-angle" aria-live="polite" aria-atomic="true"></span>
      </div>
      <div class="spin-controls">
        <p id="spinHint" class="spin-hint">Проведите влево или вправо, чтобы повернуть сумку</p>
        <div class="spin-tools" role="group" aria-label="Масштаб и полноэкранный режим">
          <button type="button" data-spin-zoom="-0.25" aria-label="Уменьшить изображение">−</button>
          <output class="spin-scale" aria-live="polite">100%</output>
          <button type="button" data-spin-zoom="0.25" aria-label="Увеличить изображение">+</button>
          <button type="button" class="spin-reset" aria-label="Сбросить масштаб и ракурс">Сбросить</button>
          <button type="button" class="spin-fullscreen" aria-label="На весь экран" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg></button>
        </div>
      </div>
      <div class="spin-thumbnails" aria-label="Выбор ракурса"></div>
      <div class="spin-message-row"><p class="spin-message" role="status"></p><button type="button" class="spin-retry underlink" hidden>Повторить загрузку</button></div>`;
    document.body.append(dialog);
    ui = {
      title: dialog.querySelector('#spinTitle'),
      source: dialog.querySelector('#spinSource'),
      modes: dialog.querySelector('.spin-modes'),
      viewport: dialog.querySelector('.spin-viewport'),
      image: dialog.querySelector('.spin-image'),
      empty: dialog.querySelector('.spin-empty'),
      loading: dialog.querySelector('.spin-loading'),
      angle: dialog.querySelector('.spin-angle'),
      hint: dialog.querySelector('#spinHint'),
      scale: dialog.querySelector('.spin-scale'),
      thumbs: dialog.querySelector('.spin-thumbnails'),
      message: dialog.querySelector('.spin-message'),
      retry: dialog.querySelector('.spin-retry'),
      fullscreen: dialog.querySelector('.spin-fullscreen')
    };

    dialog.querySelector('.spin-close').addEventListener('click', close);
    dialog.querySelector('.spin-prev').addEventListener('click', () => step(-1));
    dialog.querySelector('.spin-next').addEventListener('click', () => step(1));
    dialog.querySelector('.spin-reset').addEventListener('click', reset);
    dialog.querySelectorAll('[data-spin-zoom]').forEach(button => {
      button.addEventListener('click', () => zoom(current.scale + Number(button.dataset.spinZoom)));
    });
    ui.modes.addEventListener('click', event => {
      const button = event.target.closest('[data-spin-mode]');
      if (button) changeMode(button.dataset.spinMode);
    });
    ui.thumbs.addEventListener('click', event => {
      const button = event.target.closest('[data-spin-frame]');
      if (button && !button.disabled) {
        current.index = Number(button.dataset.spinFrame);
        render();
      }
    });
    ui.retry.addEventListener('click', () => {
      current.group.items.forEach(item => {
        if (item.state === 'error') item.state = 'idle';
      });
      loadGroup(current.id, current.group);
    });
    ui.fullscreen.addEventListener('click', fullscreen);
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener('close', restore);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    });
    dialog.addEventListener('keydown', event => {
      if (!current || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        step(event.key === 'ArrowLeft' ? -1 : 1);
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoom(current.scale + 0.25);
      } else if (event.key === '-') {
        event.preventDefault();
        zoom(current.scale - 0.25);
      } else if (event.key === 'Home' || event.key === '0') {
        event.preventDefault();
        reset();
      }
    });
    ui.image.addEventListener('load', () => {
      ui.image.hidden = false;
      ui.empty.hidden = true;
      renderTransform();
    });
    ui.image.addEventListener('error', () => {
      ui.image.hidden = true;
      ui.empty.hidden = false;
    });
    ui.viewport.addEventListener('pointerdown', pointerDown);
    ui.viewport.addEventListener('pointermove', pointerMove);
    ui.viewport.addEventListener('pointerup', pointerEnd);
    ui.viewport.addEventListener('pointercancel', pointerEnd);
    ui.viewport.addEventListener('lostpointercapture', pointerEnd);
    ui.viewport.addEventListener('wheel', event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoom(current.scale + (event.deltaY < 0 ? 0.15 : -0.15));
    }, {passive: false});
    ui.viewport.addEventListener('dblclick', event => {
      if (!event.target.closest('button')) zoom(current.scale > 1 ? 1 : 2);
    });
    document.addEventListener('fullscreenchange', updateFullscreen);
    window.addEventListener('resize', renderTransform);
  }

  function setImage(src, alt) {
    ui.image.alt = alt;
    if (ui.image.getAttribute('src') !== src) {
      ui.image.hidden = false;
      ui.empty.hidden = true;
      ui.image.src = src;
    }
  }

  function open(id) {
    if (!Object.prototype.hasOwnProperty.call(models, id)) return;
    makeDialog();
    if (dialog.open) {
      if (current?.id === id) return;
    } else {
      returnFocus = document.activeElement;
      originatingDialog = returnFocus?.closest('dialog') || document.querySelector('dialog[open]');
    }
    current = {id, mode: 'spin', index: 0, scale: 1, panX: 0, panY: 0, group: resources(id, 'spin')};
    pointers.clear();
    gesture = null;
    ui.title.textContent = models[id];
    ui.modes.querySelector('[data-spin-mode="photos"]').hidden = id !== 'velour';
    setImage(`assets/${id}.webp`, `${models[id]} — общий вид`);
    buildThumbnails();
    render();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('.spin-close').focus({preventScroll: true});
    loadGroup(id, current.group);
  }

  function loadGroup(id, group) {
    // Assets are requested only after this particular model/mode is opened.
    group.items.forEach(item => {
      if (item.state !== 'idle') return;
      item.state = 'loading';
      const image = new Image();
      image.decoding = 'async';
      let finished = false;
      const done = success => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        image.onload = null;
        image.onerror = null;
        item.state = success ? 'loaded' : 'error';
        // Retain decoded images for smooth frame changes during a drag.
        item.image = success ? image : null;
        if (current?.id === id && current.group === group && dialog.open) render();
      };
      const timeout = setTimeout(() => done(false), 15000);
      image.onload = () => done(true);
      image.onerror = () => done(false);
      image.src = item.src;
    });
    if (current?.id === id && current.group === group) render();
  }

  function buildThumbnails() {
    ui.thumbs.innerHTML = current.group.items.map((item, index) =>
      `<button type="button" class="spin-thumb" data-spin-frame="${index}" aria-label="${item.label}" aria-pressed="false"><span class="spin-thumb-image"></span><span>${current.mode === 'spin' ? `${index * 45}°` : item.label}</span></button>`
    ).join('');
  }

  function render() {
    if (!current) return;
    const {id, mode, group, index} = current;
    const loaded = group.items.filter(item => item.state === 'loaded');
    const pending = group.items.filter(item => item.state === 'idle' || item.state === 'loading').length;
    const failed = group.items.filter(item => item.state === 'error').length;
    let displayIndex = index;
    if (group.items[displayIndex].state === 'error') {
      displayIndex = group.items.findIndex(item => item.state === 'loaded');
      if (displayIndex >= 0) current.index = displayIndex;
    } else if (group.items[displayIndex].state !== 'loaded') {
      displayIndex = -1;
    }
    if (displayIndex >= 0) {
      const item = group.items[displayIndex];
      setImage(item.src, `${models[id]} — ${item.label.toLowerCase()}${mode === 'spin' ? ', визуализация AI' : ', фотография'}`);
      ui.angle.textContent = mode === 'spin'
        ? `${displayIndex * 45}° / 360°`
        : `${displayIndex + 1} / ${group.items.length} · ${item.label}`;
    } else {
      setImage(`assets/${id}.webp`, `${models[id]} — общий вид`);
      ui.angle.textContent = 'Общий вид';
    }
    ui.source.textContent = mode === 'spin' ? 'Визуализация формы · AI' : 'Фотографии сумки';
    ui.loading.hidden = pending === 0;
    ui.loading.lastElementChild.textContent = `Загружаем ${mode === 'spin' ? 'ракурсы' : 'фотографии'} · ${loaded.length}/${group.items.length}`;
    ui.viewport.setAttribute('aria-busy', String(pending > 0));
    ui.modes.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.spinMode === mode));
    });
    ui.thumbs.querySelectorAll('button').forEach((button, thumbIndex) => {
      const item = group.items[thumbIndex];
      button.setAttribute('aria-pressed', String(thumbIndex === displayIndex));
      button.disabled = item.state !== 'loaded';
      button.classList.toggle('is-loading', item.state === 'loading' || item.state === 'idle');
      const imageSlot = button.firstElementChild;
      if (item.state === 'loaded' && !imageSlot.firstElementChild) {
        const image = document.createElement('img');
        image.src = item.src;
        image.alt = '';
        image.draggable = false;
        imageSlot.append(image);
      }
    });
    ui.retry.hidden = pending > 0 || failed === 0;
    if (pending > 0) {
      ui.message.textContent = 'Можно рассматривать сумку, пока загружаются остальные изображения.';
    } else if (!loaded.length) {
      ui.message.textContent = `${mode === 'spin' ? 'Ракурсы' : 'Фотографии'} не удалось загрузить. Показан общий вид. Попробуйте ещё раз.`;
    } else if (failed) {
      ui.message.textContent = `Доступно ${loaded.length} из ${group.items.length} изображений. Часть ракурсов не загрузилась.`;
    } else {
      ui.message.textContent = mode === 'spin'
        ? '8 последовательных ракурсов. AI-визуализация помогает рассмотреть форму; детали могут отличаться от товара.'
        : 'Предоставленные фотографии: вид спереди, сзади, сбоку, внутри и крупные детали.';
    }
    dialog.querySelectorAll('.spin-arrow').forEach(button => button.disabled = loaded.length < 2);
    renderTransform();
  }

  function step(direction) {
    if (!current) return;
    const items = current.group.items;
    for (let offset = 1; offset <= items.length; offset++) {
      const candidate = (current.index + direction * offset + items.length * 2) % items.length;
      if (items[candidate].state === 'loaded') {
        current.index = candidate;
        break;
      }
    }
    render();
  }

  function changeMode(mode) {
    if (!current || mode === current.mode || (mode === 'photos' && current.id !== 'velour')) return;
    current.mode = mode;
    current.index = 0;
    current.scale = 1;
    current.panX = current.panY = 0;
    current.group = resources(current.id, mode);
    setImage(`assets/${current.id}.webp`, `${models[current.id]} — общий вид`);
    buildThumbnails();
    render();
    loadGroup(current.id, current.group);
  }

  function zoom(value) {
    if (!current) return;
    current.scale = Math.min(current.mode === 'photos' ? 3 : 2, Math.max(1, value));
    if (current.scale === 1) current.panX = current.panY = 0;
    renderTransform();
  }

  function renderTransform() {
    if (!current) return;
    const width = ui.viewport.clientWidth, height = ui.viewport.clientHeight;
    const naturalWidth = ui.image.naturalWidth || width, naturalHeight = ui.image.naturalHeight || height;
    const fit = Math.min(width / naturalWidth, height / naturalHeight);
    const maxX = Math.max(0, (naturalWidth * fit * current.scale - width) / 2);
    const maxY = Math.max(0, (naturalHeight * fit * current.scale - height) / 2);
    current.panX = Math.max(-maxX, Math.min(maxX, current.panX));
    current.panY = Math.max(-maxY, Math.min(maxY, current.panY));
    ui.image.style.transform = `translate(${current.panX}px, ${current.panY}px) scale(${current.scale})`;
    ui.scale.value = `${Math.round(current.scale * 100)}%`;
    ui.scale.textContent = ui.scale.value;
    ui.viewport.classList.toggle('is-zoomed', current.scale > 1);
    ui.hint.textContent = current.scale > 1
      ? 'Перемещайте изображение · стрелки меняют ракурс'
      : current.mode === 'spin'
        ? 'Проведите влево или вправо, чтобы повернуть сумку'
        : 'Листайте фотографии · нажмите +, чтобы рассмотреть детали';
    dialog.querySelector('[data-spin-zoom="-0.25"]').disabled = current.scale <= 1;
    dialog.querySelector('[data-spin-zoom="0.25"]').disabled = current.scale >= (current.mode === 'photos' ? 3 : 2);
  }

  function reset() {
    if (!current) return;
    current.index = 0;
    current.scale = 1;
    current.panX = current.panY = 0;
    render();
  }

  function startGesture() {
    const points = [...pointers.values()];
    if (points.length > 1) {
      gesture = {distance: Math.max(1, Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)), scale: current.scale};
    } else if (points.length === 1) {
      gesture = {x: points[0].x, y: points[0].y, panX: current.panX, panY: current.panY, travelled: 0};
    } else gesture = null;
  }

  function pointerDown(event) {
    if (!current || event.target.closest('button') || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    ui.viewport.setPointerCapture(event.pointerId);
    ui.viewport.classList.add('is-dragging');
    startGesture();
  }

  function pointerMove(event) {
    if (!current || !pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    const points = [...pointers.values()];
    if (points.length > 1 && gesture.distance) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      zoom(gesture.scale * distance / gesture.distance);
    } else if (current.scale > 1 && gesture.x !== undefined) {
      current.panX = gesture.panX + event.clientX - gesture.x;
      current.panY = gesture.panY + event.clientY - gesture.y;
      renderTransform();
    } else if (gesture.x !== undefined) {
      const distance = event.clientX - gesture.x;
      const threshold = Math.max(26, ui.viewport.clientWidth / 14);
      const frames = Math.trunc(distance / threshold);
      while (gesture.travelled !== frames) {
        const direction = frames > gesture.travelled ? 1 : -1;
        step(direction);
        gesture.travelled += direction;
      }
    }
  }

  function pointerEnd(event) {
    pointers.delete(event.pointerId);
    if (!pointers.size) ui.viewport.classList.remove('is-dragging');
    if (current) startGesture();
  }

  async function fullscreen() {
    if (!dialog?.open) return;
    if (document.fullscreenElement === dialog) {
      try { await document.exitFullscreen(); } catch { /* Keep the viewer usable. */ }
    } else if (dialog.classList.contains('is-expanded')) {
      dialog.classList.remove('is-expanded');
    } else if (dialog.requestFullscreen) {
      try {
        await dialog.requestFullscreen();
      } catch {
        dialog.classList.toggle('is-expanded');
      }
    } else {
      dialog.classList.toggle('is-expanded');
    }
    updateFullscreen();
  }

  function updateFullscreen() {
    if (!dialog) return;
    const expanded = document.fullscreenElement === dialog || dialog.classList.contains('is-expanded');
    ui.fullscreen.setAttribute('aria-pressed', String(expanded));
    ui.fullscreen.setAttribute('aria-label', expanded ? 'Выйти из полноэкранного режима' : 'На весь экран');
    renderTransform();
  }

  async function close() {
    if (!dialog?.open || isClosing) return;
    isClosing = true;
    try {
      if (document.fullscreenElement === dialog) await document.exitFullscreen();
    } catch { /* Closing must work even when fullscreen is unavailable. */ }
    dialog.close();
    isClosing = false;
  }

  function restore() {
    pointers.clear();
    gesture = null;
    current = null;
    dialog.classList.remove('is-expanded');
    ui.viewport.classList.remove('is-dragging', 'is-zoomed');
    // The originating native dialog stays open below this one, retaining scroll and selection.
    const anotherDialog = document.querySelector('dialog[open]');
    document.body.classList.toggle('modal-open', Boolean(anotherDialog));
    if (returnFocus?.isConnected && (!originatingDialog || originatingDialog.open)) {
      returnFocus.focus({preventScroll: true});
    }
    returnFocus = originatingDialog = null;
    updateFullscreen();
  }

  window.BarsaliniSpin = Object.freeze({open});
})();
