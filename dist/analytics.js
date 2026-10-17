/* Page-view analytics enabled on the existing Vercel Hobby project.
   Custom events remain disabled: this plan does not support them.
   Never record inquiry text,
   contact destinations or visitors' search terms. */
(() => {
  const config = { enabled: true, customEvents: false, scriptPath: '/_vercel/insights/script.js' };
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

// Optional Google Analytics measurement. No Google tag loads before consent.
(() => {
  if (navigator.doNotTrack === '1') return;
  const key = 'toldit-analytics-consent';
  let active = false;
  function startGoogle() {
    if (active) return; active = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', 'G-C8RH4T8WNT', { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location.origin + location.pathname });
    const tag = document.createElement('script'); tag.async = true; tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-C8RH4T8WNT'; document.head.append(tag);
  }
  const style = document.createElement('style');
  style.textContent = '.analytics-choice{position:fixed;bottom:16px;left:16px;right:16px;max-width:640px;margin:auto;z-index:90;background:#f7f6ef;color:#173d2b;border:1px solid #173d2b;border-radius:12px;padding:20px;box-shadow:0 8px 30px #173d2b26;font-size:14px;line-height:1.6}.analytics-choice p{margin:0 0 12px}.analytics-choice a{text-decoration:underline}.analytics-choice div{display:flex;flex-wrap:wrap;gap:12px}.analytics-choice button{min-height:44px}.analytics-settings{display:block;margin:12px auto 20px;border:0;background:transparent;color:#173d2b;text-decoration:underline;padding:12px;font:inherit;font-size:12px;cursor:pointer}';document.head.append(style);
  const panel = document.createElement('section'); panel.className = 'analytics-choice';panel.setAttribute('aria-label','Optional analytics');
  panel.innerHTML = '<p><strong>Help us improve Toldit.</strong><br>Allow optional Google Analytics cookies to measure visits and product inquiry clicks? Your choice does not affect browsing or contacting us. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a></p><div><button class="button" type="button" data-consent="accepted">Allow analytics</button><button class="outline" type="button" data-consent="declined">No thanks</button></div>';
  const settings=document.createElement('button');settings.type='button';settings.className='analytics-settings';settings.textContent='Analytics preferences';document.body.append(settings);
  let stored;try{stored=localStorage.getItem(key);}catch{};
  if(stored==='accepted')startGoogle(); else if(stored!=='declined')document.body.append(panel);
  settings.addEventListener('click',()=>{document.body.append(panel);panel.querySelector('button').focus();});
  panel.addEventListener('click',event=>{const button=event.target.closest('[data-consent]');if(!button)return;const choice=button.dataset.consent;try{localStorage.setItem(key,choice);}catch{};panel.remove();if(choice==='accepted')startGoogle();else if(active){window.gtag('consent','update',{analytics_storage:'denied'});location.reload();}});
  document.addEventListener('click',event=>{const link=event.target.closest('a.contact-email,a.contact-whatsapp');if(!link||!active)return;const modal=link.closest('#detail');const product=modal?modal.querySelector('#detail-title')?.textContent:link.closest('[data-product]')?.dataset.product;window.gtag('event','product_inquiry_click',{contact_channel:link.classList.contains('contact-email')?'email':'whatsapp',product_name:product||'General inquiry',proposed_format:link.closest('.page-inquiry')?.querySelector('#planned-format')?.value||'No preference',page_location:location.origin+location.pathname});});
})();
