/* Both analytics services are optional. Versioned consent asks existing visitors
   again because the choice now covers Google Analytics and Vercel Analytics. */
(() => {
  const key = 'toldit-analytics-consent-v2';
  const blocked = navigator.doNotTrack === '1';
  let active = false;
  const cleanUrl = value => { try { const u = new URL(value); return u.origin + u.pathname; } catch { return ''; } };
  function clearGoogleCookies() {
    document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => /^_ga(?:_|$)|^_gid$|^_gat/.test(n)).forEach(name => {
      for (const domain of ['', location.hostname, '.' + location.hostname]) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      }
    });
  }
  function startAnalytics() {
    if (active || blocked) return;
    active = true;
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
    window.va('beforeSend', event => { if (event.url) event.url = cleanUrl(event.url); return event; });
    const va = document.createElement('script'); va.defer = true; va.src = '/_vercel/insights/script.js'; document.head.append(va);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', 'G-C8RH4T8WNT', { allow_google_signals: false, allow_ad_personalization_signals: false, page_location: cleanUrl(location.href), page_referrer: cleanUrl(document.referrer) });
    const ga = document.createElement('script'); ga.async = true; ga.src = 'https://www.googletagmanager.com/gtag/js?id=G-C8RH4T8WNT'; document.head.append(ga);
  }
  const panel = document.createElement('section'); panel.className = 'analytics-choice'; panel.setAttribute('aria-label', 'Optional analytics');
  panel.innerHTML = blocked
    ? '<p><strong>Analytics is off.</strong><br>Your browser’s Do Not Track setting is enabled. Neither optional analytics service will load. <a href="/privacy/">Privacy &amp; analytics</a></p><button class="outline" type="button" data-dismiss>Close</button>'
    : '<p><strong>Help us improve Toldit.</strong><br>Allow Google Analytics cookies and cookie-free Vercel Analytics to measure visits and interest in our products? Your choice does not affect browsing or contacting us. <a href="/privacy/">Privacy &amp; analytics</a></p><div><button class="button" type="button" data-consent="accepted">Allow analytics</button><button class="outline" type="button" data-consent="declined">No thanks</button></div>';
  const settings = document.createElement('button'); settings.type = 'button'; settings.className = 'analytics-settings'; settings.textContent = 'Analytics preferences'; document.body.append(settings);
  let stored; try { stored = localStorage.getItem(key); } catch {}
  if (blocked || stored === 'declined') clearGoogleCookies();
  else if (stored === 'accepted') startAnalytics();
  else document.body.append(panel);
  settings.addEventListener('click', () => { document.body.append(panel); panel.querySelector('button').focus(); });
  panel.addEventListener('click', event => {
    if (event.target.closest('[data-dismiss]')) { panel.remove(); settings.focus(); return; }
    const button = event.target.closest('[data-consent]'); if (!button) return;
    const choice = button.dataset.consent; try { localStorage.setItem(key, choice); } catch {}
    panel.remove(); settings.focus();
    if (choice === 'accepted') startAnalytics();
    else { clearGoogleCookies(); if (active) { window.gtag('consent', 'update', { analytics_storage: 'denied' }); location.reload(); } }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a.contact-email,a.contact-whatsapp'); if (!link || !active) return;
    const modal = link.closest('#detail');
    const product = modal ? modal.querySelector('#detail-title')?.textContent : link.closest('[data-product]')?.dataset.product;
    window.gtag('event', 'product_inquiry_click', { contact_channel: link.classList.contains('contact-email') ? 'email' : 'whatsapp', product_name: product || 'General inquiry', proposed_format: link.closest('.page-inquiry')?.querySelector('#planned-format')?.value || 'No preference', page_location: cleanUrl(location.href) });
  });
})();
