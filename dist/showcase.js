(() => {
  // Recovery keeps genuine product names and links visible; never substitutes stock art.
  const markUnavailable = image => {
    if (image.classList.contains('image-unavailable')) return;
    const holder = image.closest('.showcase-product-image, .showcase-list-image, .card-image, .showcase-foreground figure');
    if (holder) {
      image.classList.add('image-unavailable');
      holder.classList.add('has-image-error');
      const message = document.createElement('span');
      message.className = 'image-fallback';
      message.textContent = 'Image unavailable';
      holder.append(message);
    }
  };
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) markUnavailable(event.target);
  }, true);
  document.querySelectorAll('img').forEach(image => {
    if (image.complete && !image.naturalWidth) markUnavailable(image);
  });

  const scene = document.querySelector('[data-showcase]');
  if (!scene) return;
  const ring = scene.querySelector('[data-ring]');
  const toggle = scene.querySelector('[data-motion-toggle]');
  const originals = [...ring.children];
  // Repetitions live in the decorative aria-hidden scene only. Links below are unique.
  for (let repeat = 0; repeat < 2; repeat++) originals.forEach(card => ring.append(card.cloneNode(true)));
  const cards = [...ring.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 900px), (pointer: coarse)');
  const constrained = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4) || navigator.connection?.saveData;
  const supports3d = CSS.supports('transform-style', 'preserve-3d');
  let paused = false, visible = true, frame = 0, last = 0, phase = 0, width = ring.clientWidth;
  const enabled = () => !compact.matches && supports3d;
  const canAnimate = () => enabled() && !constrained && !reduced.matches && !paused && visible && !document.hidden;

  function placeCards() {
    if (!enabled()) return;
    const radius = Math.min(1180, width * .76);
    cards.forEach((card, index) => {
      const angle = ((index * (360 / cards.length) + phase + 540) % 360) - 180;
      const shown = Math.abs(angle) < 46;
      card.style.visibility = shown ? 'visible' : 'hidden';
      if (!shown) return;
      const radians = angle * Math.PI / 180;
      const depth = radius * (1 - Math.cos(radians));
      card.style.transform = `translate3d(${radius * Math.sin(radians)}px,${-depth * .12}px,${depth}px) rotateY(${-angle}deg)`;
    });
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function tick(time) {
    frame = 0;
    // Media/visibility state may change before its event is delivered. Keep the
    // control and reported state in sync when the frame loop observes the change.
    if (!canAnimate()) { sync(); return; }
    if (!last) last = time;
    const elapsed = time - last;
    if (elapsed >= 1000 / 30) {
      phase = (phase - Math.min(elapsed, 80) * .0016) % 360;
      last = time;
      placeCards();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    stop();
    scene.classList.toggle('has-depth', enabled());
    scene.dataset.motion = canAnimate() ? 'running' : 'paused';
    toggle.hidden = !enabled() || Boolean(constrained) || reduced.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.querySelector('span').textContent = paused ? 'Resume motion' : 'Pause motion';
    placeCards();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }
  toggle.addEventListener('click', () => { paused = !paused; sync(); });
  reduced.addEventListener('change', sync);
  compact.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', sync);
  if ('ResizeObserver' in window) new ResizeObserver(() => { width = ring.clientWidth; placeCards(); }).observe(ring);
  else window.addEventListener('resize', () => { width = ring.clientWidth; placeCards(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; sync();
  }, {threshold: 0}).observe(scene);
  sync();
})();
