(() => {
  const menu = document.querySelector('#menu-toggle'), nav = document.querySelector('#main-nav'), header = document.querySelector('.site-header');
  const mobile = matchMedia('(max-width: 900px)');
  function closeMenu(returnFocus = false) {
    if (!menu || !nav) return;
    const wasOpen = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
    header?.querySelectorAll('details[open]').forEach(details => { details.open = false; });
    if (returnFocus && wasOpen) menu.focus();
  }
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav?.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!header?.contains(event.target)) closeMenu(); });
  document.addEventListener('focusin', event => { if (!header?.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const expanded = header?.querySelector('details[open]');
    if (expanded) { expanded.open = false; expanded.querySelector('summary')?.focus(); }
    else closeMenu(true);
  });
  mobile.addEventListener('change', () => closeMenu());
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    function sync() {
      const dark = document.documentElement.dataset.theme === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Use light appearance' : 'Use dark appearance');
      button.querySelector('[data-theme-label]').textContent = dark ? 'Light' : 'Dark';
    }
    sync(); button.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('toldit-theme-v1', next); } catch {}
      sync();
    });
  });
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate?.([{ opacity: .75, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.16,1,.3,1)' });
      reveal.unobserve(entry.target);
    }), { threshold: .15 });
    document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
  }
})();
