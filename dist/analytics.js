/* Activation is pending access to the Vercel project and verification of its plan.
   Fill scriptPath with the exact Web Analytics script URL shown by that project.
   Custom events require a plan that supports them. Never record inquiry text,
   contact destinations or visitors' search terms. */
(() => {
  const config = { enabled: false, customEvents: false, scriptPath: '' };
  if (!config.enabled || !config.scriptPath || navigator.doNotTrack === '1') return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', event => {
    if (event.url) { const url = new URL(event.url, location.origin); url.search = ''; url.hash = ''; event.url = url.href; }
    return event;
  });
  const script = document.createElement('script'); script.defer = true; script.src = config.scriptPath; document.head.append(script);
  if (!config.customEvents) return;
  document.addEventListener('click', event => {
    const link = event.target.closest('a.contact-email, a.contact-whatsapp');
    if (!link) return;
    const modal = link.closest('#detail');
    const product = modal ? modal.querySelector('#detail-title')?.textContent : link.closest('[data-product]')?.dataset.product;
    window.va('event', { name: 'Inquiry click', data: { channel: link.classList.contains('contact-email') ? 'Email' : 'WhatsApp', product: product || 'General inquiry' } });
  });
})();
