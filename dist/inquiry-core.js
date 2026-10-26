(() => {
  function validate(data) {
    const errors = {};
    if (!String(data.name || '').trim() || String(data.name).length > 80) errors.name = 'Enter your name (up to 80 characters).';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '') || String(data.email).length > 254) errors.email = 'Enter a valid email address so we can reply.';
    if (!String(data.message || '').trim() || String(data.message).length > 4000) errors.message = 'Tell us what you need (up to 4,000 characters).';
    if (String(data.company || '').length > 120) errors.company = 'Keep your company name under 120 characters.';
    return errors;
  }
  function links(data) {
    const subject = `${data.interest || 'General enquiry'}${data.product ? ': ' + data.product : ''}`;
    const message = [`Hello Toldit Group,`, '', String(data.message || '').trim(), '', `Name: ${String(data.name || '').trim()}`, `Reply email: ${data.email}`, data.company ? `Company: ${data.company}` : '', data.product ? `Product: ${data.product}` : '', `Interest: ${data.interest || 'General enquiry'}`].filter(line => line !== undefined).join('\n');
    return { email: `mailto:tolditgroup@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`, whatsapp: `https://wa.me/256769199999?text=${encodeURIComponent(message)}` };
  }
  globalThis.TolditInquiry = { validate, links };
})();
