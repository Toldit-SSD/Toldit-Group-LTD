import {arrow, escape} from './components.mjs';

// Selection changes presentation only. Product facts always come from products.js.
const showcaseIds = [24, 3, 1, 5, 8, 28, 45, 18];
const responsiveBase = product => product.image.replace(/^\/?assets\//, '').replaceAll('/', '-').replace(/\.webp$/, '');

export function showcase(products, heroCopy) {
  const selected = showcaseIds.map(id => products.find(product => product.id === id)).filter(Boolean);
  const image = (product, decorative = false) => {
    const base = responsiveBase(product);
    return `<img src="/assets/responsive/${base}-480.webp" width="480" height="480" decoding="async" loading="${decorative ? 'eager' : 'lazy'}" alt="${decorative ? '' : escape(product.name) + ' — illustrative packaging concept'}">`;
  };
  const ring = selected.map((product, index) => `<div class="showcase-card" data-ring-card data-index="${index}"><div class="showcase-product-image">${image(product, true)}</div><span>${escape(product.name)}</span></div>`).join('');
  const links = selected.map(product => `<li><a href="${escape(product.url)}"><span class="showcase-list-image">${image(product)}</span><span>${escape(product.name)}</span>${arrow}</a></li>`).join('');
  const food = [1, 5].map(id => products.find(product => product.id === id));
  return `<section class="showcase-hero" aria-labelledby="hero-title">
    <div class="showcase-copy">${heroCopy.replace('<h1>', '<h1 id="hero-title">')}</div>
    <div class="showcase-composition" data-showcase>
      <div class="showcase-atmosphere" aria-hidden="true"></div>
      <div class="showcase-motion"><button type="button" data-motion-toggle aria-pressed="false" hidden><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 3h3v10H4zm5 0h3v10H9z"/></svg><span>Pause motion</span></button></div>
      <div class="showcase-ring-clip" aria-hidden="true"><div class="showcase-ring" data-ring>${ring}</div></div>
      <section class="showcase-foreground" aria-labelledby="showcase-title">
        <figure><img src="/assets/responsive/hero-1280.webp" srcset="/assets/responsive/hero-480.webp 480w, /assets/responsive/hero-800.webp 800w, /assets/responsive/hero-1280.webp 1280w" sizes="(max-width:600px) 90vw, 400px" width="1400" height="933" decoding="async" fetchpriority="high" alt="Toldit peanut butter and honey packaging concepts"><figcaption>Packaging concepts · Final designs may change</figcaption></figure>
        <div class="showcase-foreground-copy"><h2 id="showcase-title">Food &amp; drink</h2><div class="showcase-food-links">${food.map(product => `<a href="${escape(product.url)}"><span><strong>${escape(product.name)}</strong><small>${escape(product.format)}</small></span>${arrow}</a>`).join('')}</div><a class="text-link" href="/food-drink/peanut-butter-honey/">Discover our food origins ${arrow}</a></div>
      </section>
      <nav class="showcase-product-nav" aria-label="Products in the showcase"><ul>${links}</ul></nav>
    </div>
  </section>`;
}
