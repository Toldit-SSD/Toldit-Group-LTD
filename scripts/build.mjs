import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {navigation,footer,productCard,contactForm,escape,arrow,categoryLink} from './components.mjs';
import {showcase} from './showcase.mjs';
const products=vm.runInNewContext(await fs.readFile('dist/products.js','utf8')+'\nPRODUCTS');
const originalHome=await fs.readFile('src/pages/index.html','utf8');
const originalHead=originalHome.match(/<head>([\s\S]*?)<\/head>/)[1];
function documentPage(title,description,route,body,scripts='') {
 const head=originalHead.replace(/<title>[\s\S]*?<\/title>/,`<title>${escape(title)} | Toldit Group</title>`).replace(/<meta name="description"[^>]+>/,`<meta name="description" content="${escape(description)}">`).replace(/<link rel="canonical"[^>]+>/,`<link rel="canonical" href="https://tolditgroup.com${route}">`).replace(/<meta property="og:(title|description|url)"[^>]+>/g,(_,key)=>`<meta property="og:${key}" content="${escape(key==='title'?title:key==='description'?description:'https://tolditgroup.com'+route)}">`);
 return `<!DOCTYPE html><html lang="en"><head>${head}</head><body><a class="skip" href="#content">Skip to main content</a><header></header><main id="content">${body}</main><footer></footer><script defer src="/analytics.js"></script>${scripts}</body></html>`;
}
const companyBody=`<section class="company-intro section"><div><h1>Everyday value.<br><span>Extraordinary potential.</span></h1><p class="lead">Toldit Group is being built around a simple idea: thoughtful, accessible products can make everyday life better.</p><p>Our vision begins in South Sudan and reaches across East Africa.</p><a class="button" href="/#catalog">Explore our collections ${arrow}</a></div><figure><img src="/assets/hero.webp" width="1400" height="933" alt="Toldit peanut butter and honey packaging concepts"><figcaption>Illustrative product concepts. Final packaging is not confirmed.</figcaption></figure></section><section class="company-story section"><h2>One group.<br>A shared ambition.</h2><div><p>Foods and home care form our foundation. Personal care, clothing, practical technology and new services extend that vision—one considered collection at a time.</p><p>Our products remain in development. Final specifications, pricing and availability are yet to be confirmed.</p><a class="text-link" href="/food-drink/peanut-butter-honey/">Explore our food origins ${arrow}</a></div></section><section class="closing-cta section"><div><h2>Build the next chapter<br>with Toldit.</h2><p>Start a conversation about our planned collections, partnerships or distribution.</p></div><a class="button" href="/contact/?interest=Distribution">Become a distributor ${arrow}</a></section>`;
const contactBody=`<section class="contact-layout section"><div class="contact-intro"><h1>Let’s build<br><span>possibilities.</span></h1><p class="lead">A product question. A partnership idea. A conversation about what comes next.</p><p>Our collections are in development. Tell us what you’re interested in, and prepare an enquiry for our team.</p><div class="contact-direct"><h2>Prefer to get in touch directly?</h2><a href="mailto:tolditgroup@gmail.com">tolditgroup@gmail.com ${arrow}</a><a href="https://wa.me/256769199999" target="_blank" rel="noopener noreferrer">WhatsApp Toldit Group ${arrow}</a></div><p class="note">Prices, availability and supply arrangements are subject to confirmation. This is an enquiry, not an order.</p></div><div class="contact-form-panel"><h2>Start the conversation.</h2><p class="form-help">Fields marked * are required.</p>${contactForm(products)}</div></section>`;
await fs.mkdir('src/pages/company',{recursive:true});await fs.mkdir('src/pages/contact',{recursive:true});
await fs.writeFile('src/pages/company/index.html',documentPage('Our company','Meet Toldit Group and explore the ambition behind its developing consumer-product collections.','/company/',companyBody));
await fs.writeFile('src/pages/contact/index.html',documentPage('Contact Toldit Group','Ask about Toldit products, request a quotation or discuss distribution. Prepare an email or WhatsApp enquiry.','/contact/',contactBody,'<script src="/inquiry-core.js"></script><script src="/contact.js"></script>'));
const files=(await fs.readdir('src/pages',{recursive:true})).filter(file=>file.endsWith('.html'));
for(const file of files){
 let html=await fs.readFile(path.join('src/pages',file),'utf8');
 const route='/'+file.replace(/index\.html$/,'');
 html=html.replace(/<header[\s\S]*?<\/header>/,navigation(route)).replace(/<footer[\s\S]*?<\/footer>/,footer());
 html=html.replace(/<link rel="stylesheet" href="(?:\/?|\.\.\/)style\.css[^\"]*">/g,'<link rel="stylesheet" href="/style.css?v=20261026"><link rel="stylesheet" href="/design.css?v=20261026">');
 html=html.replace('<head>','<head><link rel="icon" type="image/svg+xml" href="/favicon.svg"><script src="/theme.js"></script><link rel="preload" href="/fonts/manrope-variable.woff" as="font" type="font/woff" crossorigin>');
 html=html.replace(/(<script[^>]+src=")[^\"]*(products|app|page|analytics)\.js[^\"]*(")/g,'$1/$2.js?v=20261026$3');
 html=html.replace('</head>','<link rel="stylesheet" href="/showcase.css?v=20261026"></head>');
 html=html.replace('</body>','<script defer src="/site.js?v=20261026"></script><script defer src="/showcase.js?v=20261026"></script></body>');
 html=html.replace(/<main(?![^>]*\bid=)/,'<main id="content"');
 html=html.replace(/<a class="skip"[^>]+>/,'<a class="skip" href="#content">');
 // Category and development labels carry useful information, but do not masquerade as headings.
 html=html.replace(/<p class="eyebrow">([^<]+)<\/p>/g,(_,label)=>label.includes('IN DEVELOPMENT')?`<p class="product-status">${label}</p>`:'');
 html=html.replace(/<span class="eyebrow">IN DEVELOPMENT<\/span>/g,'<span class="product-status">In development</span>');
 if(route==='/'){
  html=html.replace(/<section class="hero">[\s\S]*?<\/section>/,`<section class="premium-hero"><div class="hero-copy"><h1>Everyday essentials.<br><span>Greater possibilities.</span></h1><p>From the food on your table to the things that make a house a home. A growing world of Toldit, with South Sudan at heart.</p><div class="hero-actions"><a class="button" href="#catalog">Explore products ${arrow}</a><a class="hero-secondary" href="/contact/?interest=Distribution">Partner with Toldit ${arrow}</a></div><div class="hero-honesty"><span></span>Collections in development. Enquiries welcome.</div></div><figure class="premium-hero-visual"><img src="/assets/hero.webp" width="1400" height="933" fetchpriority="high" alt="Toldit peanut butter and honey packaging concepts"><figcaption>Packaging concepts · Final designs may change</figcaption></figure></section>`);
  html=html.replace(/<div class="ribbon">[\s\S]*?<\/div>/,`<nav class="collection-strip" aria-label="Featured collections">${['Food & drink','Home & care','Fragrances'].map(name=>`<a href="${escape(categoryLink(name))}">${escape(name)} ${arrow}</a>`).join('')}<a href="/collections/">The full collection ${arrow}</a></nav>`);
  html=html.replace('<h2>A world of Toldit.</h2>','<h2>Made for the everyday.</h2>');
  html=html.replace('<div id="grid" class="grid"></div>',`<div id="grid" class="grid">${products.slice(0,8).map(productCard).join('')}</div><noscript><p class="note">Search and filters need JavaScript. <a href="/collections/">Browse every product and venture here.</a></p></noscript>`);
  html=html.replace('<span id="results" aria-live="polite"></span>','<span id="results" aria-live="polite">Explore the collection</span>');
  html=html.replace(/<section id="contact"[\s\S]*?<\/section>/,`<section id="contact" class="closing-cta section" data-reveal><div><h2>Good things begin<br>with a conversation.</h2><p>Product questions, distribution ideas or a partnership in mind? Let’s explore the possibilities together.</p></div><div class="closing-actions"><a class="button" href="/contact/">Contact Toldit Group ${arrow}</a><a class="text-link" href="/contact/?interest=Quotation">Request a quotation ${arrow}</a></div></section>`);
  html=html.replace('<script src="/app.js','<script src="/catalog-core.js"></script><script src="/app.js');
  // Keep the previous approved copy verbatim while replacing its visual composition.
  const heroCopy=html.match(/<section class="premium-hero"><div class="hero-copy">([\s\S]*?)<\/div><figure/)[1];
  html=html.replace(/<section class="premium-hero">[\s\S]*?<\/section>/,showcase(products,heroCopy));
  html=html.replace('<body>','<body class="page-home">');
 }
 const product=products.find(p=>p.url===route);
 if(product)html=html.replace('<div class="contact-links">',`<a class="quote-link" href="/contact/?interest=Quotation&amp;product=${encodeURIComponent(product.name)}">Prepare a detailed enquiry ${arrow}</a><div class="contact-links">`);
 html=html.replace(/<img\b[^>]*src="(\/?assets\/[^\"]+\.webp)"[^>]*>/g,(tag,src)=>{
  if(tag.includes('srcset=') || src.includes('/responsive/'))return tag;
  const base=src.replace(/^\/?assets\//,'').replace(/\//g,'-').replace(/\.webp$/,'');
  const hero=src.endsWith('/hero.webp');
  return tag.replace(/src="[^"]+"/,`src="/assets/responsive/${base}-${hero?1280:800}.webp" srcset="/assets/responsive/${base}-480.webp 480w, /assets/responsive/${base}-800.webp 800w${hero?`, /assets/responsive/${base}-1280.webp 1280w`:''}" sizes="${hero?'(max-width:900px) 100vw, 50vw':'(max-width:600px) 90vw, 45vw'}" decoding="async"`);
 });
 const output=path.join('dist',file);await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,html);
}
const inlineHashes=new Set();for(const file of files){const html=await fs.readFile(path.join('dist',file),'utf8');for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g))inlineHashes.add("'sha256-"+createHash('sha256').update(match[1]).digest('base64')+"'");}
const config=JSON.parse(await fs.readFile('vercel.json','utf8'));const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy');csp.value=csp.value.replace(/script-src [^;]+;/,"script-src 'self' https://www.googletagmanager.com "+[...inlineHashes].sort().join(' ')+';');await fs.writeFile('vercel.json',JSON.stringify(config,null,2)+'\n');
let sitemap=await fs.readFile('dist/sitemap.xml','utf8');for(const route of ['/company/','/contact/']){const url='https://tolditgroup.com'+route;if(!sitemap.includes(url))sitemap=sitemap.replace('</urlset>',`<url><loc>${url}</loc></url>\n</urlset>`);}await fs.writeFile('dist/sitemap.xml',sitemap);
console.log(`Built ${files.length} static pages; preserved ${products.length} product/venture records and refreshed CSP hashes.`);
