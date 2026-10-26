(() => {
  const form = document.querySelector('#contact-form'); if (!form) return;
  const params = new URLSearchParams(location.search);
  for (const name of ['product', 'interest']) {
    const field = form.elements.namedItem(name);
    const value = params.get(name);
    if (value && [...field.options].some(option => option.value === value)) field.value = value;
  }
  const result = document.querySelector('#inquiry-result');
  const status = document.querySelector('#form-status');
  form.addEventListener('input', () => { result.hidden = true; status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = TolditInquiry.validate(data);
    for (const name of ['name', 'email', 'company', 'message']) {
      const field = form.elements.namedItem(name), message = document.querySelector('#error-' + name);
      field.setAttribute('aria-invalid', String(!!errors[name])); message.textContent = errors[name] || '';
    }
    const first = Object.keys(errors)[0];
    if (first) { result.hidden = true; status.textContent = 'Please check the highlighted fields.'; form.elements.namedItem(first).focus(); return; }
    const links = TolditInquiry.links(data);
    result.querySelector('.contact-email').href = links.email;
    result.querySelector('.contact-whatsapp').href = links.whatsapp;
    result.dataset.product = data.product;
    result.hidden = false;
    status.textContent = 'Your draft is ready. Choose an app below, review your message, and send it there. Nothing has been sent yet.';
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
})();
