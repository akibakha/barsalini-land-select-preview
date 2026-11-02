/* Progressive enhancement: no hidden classes, no navigation interception. */
(() => {
  'use strict';

  if (!('animate' in Element.prototype)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animated = new WeakSet();
  const activeAnimations = new Set();
  const images = new WeakMap();
  const ease = 'cubic-bezier(.22,.72,.24,1)';
  const revealSelector = [
    '.section-heading', '.collection-toolbar', '.product-card',
    '.closeup-collection', '.model-story-photo', '.model-story-copy',
    '.editorial-grid > figure', '.real-lookbook > figure', '.story-intro',
    '.material-image', '.material-copy', '.maison', '.footer-top'
  ].join(',');

  function play(element, keyframes, timing) {
    if (reducedMotion.matches || !element.isConnected) return;
    const animation = element.animate(keyframes, timing);
    activeAnimations.add(animation);
    const release = () => activeAnimations.delete(animation);
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        const entering = entries.filter(entry => entry.isIntersecting);
        entering.forEach((entry, index) => {
          observer.unobserve(entry.target);
          if (animated.has(entry.target)) return;
          animated.add(entry.target);
          // Elements are already visible. Only the entering frame is animated.
          play(entry.target, [
            { opacity: .36, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], { duration: 720, delay: Math.min(index * 45, 135), easing: ease });
        });
      }, { threshold: .06, rootMargin: '0px 0px -24px 0px' })
    : null;

  function observeReveals(root) {
    if (!observer) return;
    const elements = [];
    if (root.matches?.(revealSelector)) elements.push(root);
    elements.push(...root.querySelectorAll(revealSelector));
    for (const element of elements) {
      if (!animated.has(element)) observer.observe(element);
    }
  }

  function prepareImage(image) {
    if (images.has(image)) return;
    const state = { source: image.currentSrc || image.src, animation: null };
    images.set(image, state);
    image.addEventListener('load', () => {
      const source = image.currentSrc || image.src;
      if (source === state.source) return;
      state.source = source;
      state.animation?.cancel();
      if (reducedMotion.matches || !image.closest('dialog[open]')) return;
      // Leave transforms to the existing detail zoom and the model gallery.
      state.animation = image.animate([{ opacity: .45 }, { opacity: 1 }], {
        duration: 420, easing: ease
      });
      const animation = state.animation;
      activeAnimations.add(animation);
      const release = () => activeAnimations.delete(animation);
      animation.addEventListener('finish', release, { once: true });
      animation.addEventListener('cancel', release, { once: true });
    });
  }

  function enhance(root) {
    observeReveals(root);
    if (root.matches?.('#lookImage, #detailPhoto')) prepareImage(root);
    root.querySelectorAll('#lookImage, #detailPhoto').forEach(prepareImage);
  }

  enhance(document);

  // Product filtering and product dialogs replace their contents dynamically.
  const updates = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.removedNodes) {
        if (!(node instanceof Element) || !observer) continue;
        observer.unobserve(node);
        node.querySelectorAll(revealSelector).forEach(element => observer.unobserve(element));
      }
      for (const node of record.addedNodes) {
        if (node instanceof Element) enhance(node);
      }
    }
  });
  updates.observe(document.body, { childList: true, subtree: true });

  const stopMotion = () => {
    if (!reducedMotion.matches) return;
    for (const animation of activeAnimations) animation.cancel();
    activeAnimations.clear();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', stopMotion);
  else reducedMotion.addListener(stopMotion);
})();
