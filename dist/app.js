const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category='All products',limit=8;
const matchesSearch = TolditCatalog.matchesSearch;
function restoreCatalogue(){const state=TolditCatalog.readState(location.search,PRODUCTS);category=state.category;$('#search').value=state.query;$('#catalog-sort').value=state.sort;}
function saveCatalogue(){const url=new URL(location.href);const state={query:$('#search').value,category,sort:$('#catalog-sort').value};const params=new URLSearchParams(TolditCatalog.searchParams(state));for(const key of ['q','category','sort']){params.has(key)?url.searchParams.set(key,params.get(key)):url.searchParams.delete(key)}history.replaceState(null,'',url);}
const categories=['All products',...new Set(PRODUCTS.map(p=>p.category))];
function animate(el,frames,options={}) {if(reduced.matches||!el.animate)return;const a=el.animate(frames,{duration:260,easing:'cubic-bezier(.2,.7,.2,1)',...options});return a;}
function imagePath(path,width){return '/assets/responsive/'+path.replace(/^\/?assets\//,'').replace(/\//g,'-').replace(/\.webp$/,'')+'-'+width+'.webp'}
function artwork(p){return p.image?`<img src="${escape(imagePath(p.image,480))}" srcset="${escape(imagePath(p.image,480))} 480w, ${escape(imagePath(p.image,800))} 800w" sizes="(max-width: 600px) 46vw, (max-width: 1000px) 31vw, 23vw" alt="${escape(p.name)} — Toldit branded concept render" width="800" height="800" loading="lazy" decoding="async">`:`<div class="placeholder"><b>TOLDIT</b><span>${escape(p.name)}</span></div>`;}
$('#filters').innerHTML=categories.map(c=>`<button aria-pressed="false" data-filter="${escape(c)}">${escape(c)}</button>`).join('');
function render(append=false){
 const query=$('#search').value.trim().toLowerCase();
 const matches=PRODUCTS.filter(p=>matchesSearch(p,query));
 const found=matches.filter(p=>category==='All products'||p.category===category);
 const sort=$('#catalog-sort').value;if(sort!=='featured')found.sort((a,b)=>sort==='az'?a.name.localeCompare(b.name):b.name.localeCompare(a.name));
 $('#clear-filters').hidden=category==='All products'&&!query&&sort==='featured';
 saveCatalogue();
 $('#filters').querySelectorAll('button').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);const count=matches.filter(p=>b.dataset.filter==='All products'||p.category===b.dataset.filter).length;b.textContent=b.dataset.filter+' ('+count+')';});
 $('#results').textContent=`Showing ${Math.min(limit,found.length)} of ${found.length} ${found.length===1?'concept':'concepts'}${category==='All products'?'':' in '+category}`;
 const previous=append?$('#grid').children.length:0;
 const html=found.slice(previous,limit).map(p=>`<article class="card"><a class="product-card-link" href="${escape(p.url)}" aria-label="Explore ${escape(p.name)}"><div class="card-image">${artwork(p)}<span class="tag">IN DEVELOPMENT</span></div><div class="card-text"><small>${escape(p.category)}</small><h3>${escape(p.name)}<span class="product-arrow" aria-hidden="true"><svg class="ui-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></span></h3><p>${escape(p.format)}</p></div></a></article>`).join('');
 if(append)$('#grid').insertAdjacentHTML('beforeend',html);else $('#grid').innerHTML=html||'<div class="empty-state"><h3>No products found</h3><p>Try a different name or explore the full collection.</p><button class="outline" id="reset-search">Reset filters and search</button></div>';
 const cards=[...$('#grid').querySelectorAll('.card')].slice(previous);
 cards.forEach((card,i)=>animate(card,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(i*25,180)}));
 $('#show-more').hidden=found.length<=limit;
 if(append){cards[0]?.querySelector('a').focus({preventScroll:true});}
}
const returnFocus=new WeakMap(),closing=new WeakMap();
function openDialog(d){if(d.open)return;returnFocus.set(d,document.activeElement);document.body.classList.add('dialog-open');d.showModal();animate(d,[{opacity:0,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}]);}
function closeDialog(d){if(!d.open||closing.has(d))return;const a=animate(d,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],{duration:180});const finish=()=>{d.close();closing.delete(d);if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');const target=returnFocus.get(d);if(target?.isConnected)target.focus({preventScroll:true});};if(a){closing.set(d,a);a.finished.then(finish,finish);}else finish();}
function detail(id){
 const p=PRODUCTS.find(p=>p.id===id);if(!p)return;
 const message=`Hello Toldit Group, I’m interested in ${p.name}. Could you share more information and expected availability?`;
 const email=`mailto:tolditgroup@gmail.com?subject=${encodeURIComponent('Product inquiry: '+p.name)}&body=${encodeURIComponent(message)}`;
 const whatsapp=`https://wa.me/256769199999?text=${encodeURIComponent(message)}`;
 $('#detail-content').innerHTML=`<div class="detail-layout"><div>${artwork(p)}</div><div><p class="eyebrow">${escape(p.category)} / IN DEVELOPMENT</p><h2 id="detail-title">${escape(p.name)}</h2><p>${escape(p.description)}</p>${p.origin?`<p>${escape(p.origin)}</p>`:""}${p.url?`<p><a class="text-link" href="${escape(p.url)}">Full product details and FAQs</a></p>`:""}<p><strong>Planned format</strong><br>${escape(p.format)}</p><p class="note">Availability and pricing have not been confirmed. Images and specifications are illustrative concepts.</p><button class="button" id="inquire-product" aria-expanded="false" aria-controls="inquiry-options">Inquire</button><div id="inquiry-options" hidden><p>How would you like to inquire about ${escape(p.name)}?</p><div class="contact-links"><a class="button contact-button contact-email" href="${escape(email)}"><svg class="ui-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg><span>Email us</span></a><a class="button contact-button contact-whatsapp" href="${escape(whatsapp)}" target="_blank" rel="noopener noreferrer"><svg class="ui-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.3-4.8A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8.5 7.5c-.6 0-1 1-1 1.7 0 2.8 4.3 6.7 6.8 6.7.8 0 1.7-.8 1.7-1.4l-2.4-1.2-.9.9c-1.4-.6-2.4-1.6-3-3l.8-.9-1.1-2.8Z"/></svg><span>WhatsApp us</span></a></div><p class="note">Your message includes this product’s name. Review and send it in your email or WhatsApp app.</p></div></div></div>`;
 $('#inquire-product').onclick=()=>{const options=$('#inquiry-options');const open=options.hidden;options.hidden=!open;$('#inquire-product').setAttribute('aria-expanded',String(open));if(open){animate(options,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}]);options.querySelector('a').focus({preventScroll:true});}};
 openDialog($('#detail'));
}
$('#filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(b){category=b.dataset.filter;limit=8;render();}};
$('#search').oninput=()=>{limit=8;render();};
$('#catalog-sort').onchange=()=>{limit=8;render();};
function resetCatalogue(){category='All products';limit=8;$('#search').value='';$('#catalog-sort').value='featured';render();$('#search').focus();}
$('#clear-filters').onclick=resetCatalogue;
addEventListener('popstate',()=>{restoreCatalogue();limit=8;render();});
$('#show-more').onclick=()=>{limit+=8;render(true);};
$('#grid').onclick=e=>{if(e.target.closest('#reset-search')){resetCatalogue();return;}const b=e.target.closest('[data-id]');if(b)detail(Number(b.dataset.id));};
document.querySelectorAll('[data-venture]').forEach(b=>b.onclick=()=>detail(PRODUCTS.find(p=>p.name===b.dataset.venture)?.id));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>closeDialog(d);d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target,[{opacity:.3,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:320});observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.section-head,.values article,.venture-grid article,.story h2,.partner h2').forEach(el=>observer.observe(el));}
reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>a.finish());});
restoreCatalogue();render();animate($('.hero-copy'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});

