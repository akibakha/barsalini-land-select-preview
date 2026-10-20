'use strict';
(() => {
  const section = document.getElementById('formStudio');
  if (!section) return;
  const viewport = section.querySelector('.studio-viewport');
  const picture = section.querySelector('.studio-image');
  const selector = section.querySelector('#studioModel');
  const status = section.querySelector('.studio-status');
  const angle = section.querySelector('.studio-angle');
  const angles = section.querySelector('.studio-angles');
  const cache = new Map();
  let model = products.find(product => product.id === 'velour');
  let frame = 0;
  let visible = false;
  let drag = null;
  let timer = null;
  const autoButton = section.querySelector('[data-studio-auto]');

  selector.innerHTML = products.map(product => `<option value="${product.id}">N° ${product.number} — ${product.name}</option>`).join('');
  selector.value = model.id;
  angles.innerHTML = Array.from({length: 8}, (_, index) => `<button type="button" data-angle="${index}" aria-label="Ракурс ${index * 45} градусов" aria-pressed="false">${index * 45}°</button>`).join('');

  function group() {
    if (!cache.has(model.id)) cache.set(model.id, Array.from({length: 8}, (_, index) => ({
      url: `assets/spin/${model.id}/${String(index + 1).padStart(2, '0')}.webp`, state: 'idle'
    })));
    return cache.get(model.id);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    autoButton.textContent = 'Автоповорот';
    autoButton.setAttribute('aria-pressed', 'false');
  }

  function render() {
    const items = group();
    const ready = items.filter(item => item.state === 'loaded').length;
    const loading = items.some(item => item.state === 'idle' || item.state === 'loading');
    if (items[frame].state === 'error') {
      const first = items.findIndex(item => item.state === 'loaded');
      if (first >= 0) frame = first;
    }
    const frameReady = items[frame].state === 'loaded';
    const source = frameReady ? items[frame].url : `assets/${model.id}.webp`;
    if (picture.getAttribute('src') !== source) picture.src = source;
    picture.alt = `${model.name} — ${frameReady ? `AI-ракурс ${frame * 45}°` : 'каталожный вид'}`;
    angle.textContent = frameReady ? `${String(frame * 45).padStart(3, '0')}° / 360°` : 'Общий вид';
    viewport.setAttribute('aria-label', `Поворот сумки ${model.name}, ${frame * 45} градусов. Используйте стрелки на клавиатуре или кнопки ракурсов.`);
    section.querySelectorAll('[data-angle]').forEach(button => {
      const index = Number(button.dataset.angle);
      button.disabled = items[index].state !== 'loaded';
      button.setAttribute('aria-pressed', String(index === frame && frameReady));
    });
    section.querySelectorAll('[data-studio-step]').forEach(button => button.disabled = ready < 2);
    autoButton.disabled = ready < 2;
    if (!visible) status.textContent = 'Проведите по изображению, чтобы повернуть сумку';
    else if (loading) status.textContent = `Подготавливаем ракурсы · ${ready} из 8`;
    else if (ready === 8) status.textContent = 'Проведите влево или вправо · 8 ракурсов';
    else status.textContent = ready ? `Доступно ${ready} из 8 ракурсов. Остальные можно загрузить повторно.` : 'Ракурсы не загрузились. Каталожное фото доступно.';
    section.querySelector('[data-studio-retry]').hidden = loading || ready === 8;
  }

  function load() {
    const id = model.id;
    group().forEach(item => {
      if (item.state === 'loaded' || item.state === 'loading') return;
      item.state = 'loading';
      const image = new Image();
      let settled = false;
      const timeout = setTimeout(() => finish('error'), 15000);
      const finish = state => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        item.state = state;
        if (model.id === id) render();
      };
      image.onload = () => finish('loaded');
      image.onerror = () => finish('error');
      image.src = item.url;
    });
    render();
  }

  function choose(id) {
    stop();
    model = products.find(product => product.id === id) || products[0];
    frame = 0;
    section.querySelector('.studio-name').textContent = model.name;
    section.querySelector('.studio-color').textContent = model.color;
    section.querySelector('.studio-price').textContent = money(model.price);
    section.querySelector('[data-spin]').dataset.spin = model.id;
    section.querySelector('[data-product]').dataset.product = model.id;
    section.querySelector('.studio-photo-note').hidden = !model.photographed;
    viewport.setAttribute('aria-label', `Поворот сумки ${model.name}`);
    render();
    if (visible) load();
  }

  function step(direction) {
    const items = group();
    for (let distance = 1; distance <= 8; distance++) {
      const next = (frame + direction * distance + 16) % 8;
      if (items[next].state === 'loaded') {frame = next; break;}
    }
    render();
  }

  selector.addEventListener('change', () => choose(selector.value));
  section.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target || target.disabled) return;
    if (target.hasAttribute('data-angle')) {stop(); frame = Number(target.dataset.angle); render();}
    if (target.hasAttribute('data-studio-step')) {stop(); step(Number(target.dataset.studioStep));}
    if (target.hasAttribute('data-studio-retry')) load();
    if (target.hasAttribute('data-studio-auto')) {
      if (timer) stop();
      else {
        autoButton.textContent = 'Остановить';
        autoButton.setAttribute('aria-pressed', 'true');
        timer = setInterval(() => step(1), 950);
      }
    }
  });
  viewport.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); stop();
    if (event.key.startsWith('Arrow')) step(event.key === 'ArrowLeft' ? -1 : 1);
    else {
      const available = group().map((item, index) => item.state === 'loaded' ? index : -1).filter(index => index >= 0);
      frame = (event.key === 'Home' ? available[0] : available.at(-1)) ?? 0;
      render();
    }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.target.closest('button')) return;
    stop(); drag = {id: event.pointerId, x: event.clientX, y: event.clientY, active: false};
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || drag.id !== event.pointerId) return;
    if (event.pointerType === 'mouse' && !(event.buttons & 1)) {drag = null; return;}
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.active && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {drag = null; return;}
    if (Math.abs(dx) > Math.max(25, viewport.clientWidth / 12)) {
      if (!drag.active) {viewport.setPointerCapture(event.pointerId); drag.active = true;}
      step(dx > 0 ? 1 : -1);
      drag.x = event.clientX; drag.y = event.clientY;
    }
  });
  ['pointerup', 'pointercancel'].forEach(type => window.addEventListener(type, () => {drag = null;}));
  viewport.addEventListener('lostpointercapture', () => {drag = null;});
  document.addEventListener('visibilitychange', () => {if (document.hidden) stop();});
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {visible = true; load();}
      else {visible = false; stop();}
    });
  }, {rootMargin: '180px'});
  observer.observe(section);
  choose(model.id);
})();
