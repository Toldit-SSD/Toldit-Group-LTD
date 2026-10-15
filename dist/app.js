const $ = s => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const escape = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let category='All products',limit=12,selected=[],toastTimer;
try {const saved=JSON.parse(localStorage.getItem('toldit-shortlist')||'[]');if(Array.isArray(saved))selected=[...new Set(saved)].filter(id=>PRODUCTS.some(p=>p.id===id));} catch {}
const categories=['All products',...new Set(PRODUCTS.map(p=>p.category))];
function animate(el,frames,options={}) {if(reduced.matches||!el.animate)return;const a=el.animate(frames,{duration:260,easing:'cubic-bezier(.2,.7,.2,1)',...options});return a;}
function artwork(p){return p.image?`<img src="${escape(p.image)}" alt="${escape(p.name)} — Toldit branded concept render" width="800" height="800" loading="lazy" decoding="async">`:`<div class="placeholder"><b>TOLDIT</b><span>${escape(p.name)}</span></div>`;}
$('#filters').innerHTML=categories.map(c=>`<button aria-pressed="false" data-filter="${escape(c)}">${escape(c)}</button>`).join('');
function render(append=false){
 const query=$('#search').value.trim().toLowerCase();
 const found=PRODUCTS.filter(p=>(category==='All products'||p.category===category)&&[p.name,p.description,p.category,p.format].join(' ').toLowerCase().includes(query));
 $('#filters').querySelectorAll('button').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 $('#results').textContent=`${found.length} ${found.length===1?'product':'products'} to explore`;
 const previous=append?$('#grid').children.length:0;
 const html=found.slice(previous,limit).map(p=>`<article class="card"><button data-id="${p.id}" aria-label="Explore ${escape(p.name)}"><div class="card-image">${artwork(p)}<span class="tag">IN DEVELOPMENT</span></div><div class="card-text"><small>${escape(p.category)}</small><h3>${escape(p.name)}<span aria-hidden="true">↗</span></h3><p>${escape(p.format)}</p></div></button></article>`).join('');
 if(append)$('#grid').insertAdjacentHTML('beforeend',html);else $('#grid').innerHTML=html||'<div class="empty-state"><h3>No products found</h3><p>Try a different name or explore the full collection.</p><button class="outline" id="reset-search">Reset filters and search</button></div>';
 const cards=[...$('#grid').querySelectorAll('.card')].slice(previous);
 cards.forEach((card,i)=>animate(card,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(i*25,180)}));
 $('#show-more').hidden=found.length<=limit;
 if(append){cards[0]?.querySelector('button').focus({preventScroll:true});$('#results').textContent+=`. Showing ${Math.min(limit,found.length)}.`;}
}
function notify(message,undo){clearTimeout(toastTimer);const toast=$('#toast');toast.replaceChildren();const span=document.createElement('span');span.textContent=message;toast.append(span);if(undo){const b=document.createElement('button');b.textContent='Undo';b.onclick=()=>{undo();notify('Product restored to your shortlist.');};toast.append(b);}toast.hidden=false;animate(toast,[{opacity:0,translate:'0 8px'},{opacity:1,translate:'0 0'}]);toastTimer=setTimeout(()=>{if(!toast.contains(document.activeElement))toast.hidden=true;},undo?10000:4500);}
function persist(){try{localStorage.setItem('toldit-shortlist',JSON.stringify(selected));}catch{}$('#count').textContent=selected.length;animate($('#count'),[{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:180});listRender();syncAdd();}
function syncAdd(){const b=$('#add-product');if(b){const added=selected.includes(Number(b.dataset.product));b.textContent=added?'Added ✓ · Remove':'Add to shortlist +';b.setAttribute('aria-pressed',added);}}
function toggle(id){const p=PRODUCTS.find(p=>p.id===id);if(!p)return;const removed=selected.includes(id);const index=selected.indexOf(id);selected=removed?selected.filter(x=>x!==id):[...selected,id];persist();notify(removed?`${p.name} removed.`:`${p.name} added to your shortlist.`,removed?()=>{if(!selected.includes(id))selected.splice(Math.min(index,selected.length),0,id);persist();}:null);}
const returnFocus=new WeakMap(),closing=new WeakMap();
function openDialog(d){if(d.open)return;returnFocus.set(d,document.activeElement);document.body.classList.add('dialog-open');d.showModal();animate(d,d.id==='shortlist'?[{opacity:0,transform:'translateX(32px)'},{opacity:1,transform:'translateX(0)'}]:[{opacity:0,transform:'translateY(12px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}]);}
function closeDialog(d){if(!d.open||closing.has(d))return;const a=animate(d,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],{duration:180});const finish=()=>{d.close();closing.delete(d);if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');const target=returnFocus.get(d);if(target?.isConnected)target.focus({preventScroll:true});};if(a){closing.set(d,a);a.finished.then(finish,finish);}else finish();}
function detail(id){const p=PRODUCTS.find(p=>p.id===id);if(!p)return;$('#detail-content').innerHTML=`<div class="detail-layout"><div>${artwork(p)}</div><div><p class="eyebrow">${escape(p.category)} / IN DEVELOPMENT</p><h2 id="detail-title">${escape(p.name)}</h2><p>${escape(p.description)}</p><p><strong>Planned format</strong><br>${escape(p.format)}</p><p class="note">Availability and pricing have not been confirmed. Images and specifications are illustrative concepts.</p><button class="button" id="add-product" data-product="${id}"></button><div class="dialog-feedback" role="status" aria-live="polite"></div></div></div>`;syncAdd();$('#add-product').onclick=()=>{toggle(id);$('.dialog-feedback').textContent=selected.includes(id)?'Saved to your shortlist.':'Removed from your shortlist.';};openDialog($('#detail'));}
function listRender(){const focused=document.activeElement?.dataset.remove;const focusIndex=selected.indexOf(Number(focused));$('#list-items').innerHTML=selected.length?selected.map(id=>{const p=PRODUCTS.find(p=>p.id===id);return `<div><span>${escape(p.name)}</span><button data-remove="${id}" aria-label="Remove ${escape(p.name)}">Remove</button></div>`;}).join(''):'<p class="note">Your shortlist is empty. Explore the catalog to add products, or contact us about a partnership.</p>';if(focused&&$('#shortlist').open){const buttons=$('#list-items').querySelectorAll('button');(buttons[Math.max(0,focusIndex)]||buttons[buttons.length-1]||$('#shortlist .contact-links a')).focus({preventScroll:true});}}
$('#filters').onclick=e=>{const b=e.target.closest('[data-filter]');if(b){category=b.dataset.filter;limit=12;render();}};
$('#search').oninput=()=>{limit=12;render();};
$('#show-more').onclick=()=>{limit+=12;render(true);};
$('#grid').onclick=e=>{if(e.target.closest('#reset-search')){category='All products';limit=12;$('#search').value='';render();$('#search').focus();return;}const b=e.target.closest('[data-id]');if(b)detail(Number(b.dataset.id));};
document.querySelectorAll('[data-venture]').forEach(b=>b.onclick=()=>detail(PRODUCTS.find(p=>p.name===b.dataset.venture)?.id));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>closeDialog(d);d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});});
$('#open-list').onclick=()=>{listRender();openDialog($('#shortlist'));};
$('#list-items').onclick=e=>{const b=e.target.closest('[data-remove]');if(b){const id=Number(b.dataset.remove);toggle(id);const feedback=$('#shortlist-feedback');feedback.replaceChildren(document.createTextNode('Product removed. '));const undo=document.createElement('button');undo.textContent='Undo';undo.onclick=()=>{if(!selected.includes(id)){selected.push(id);persist();}feedback.textContent='Product restored.';$('#shortlist .contact-links a').focus({preventScroll:true});};feedback.append(undo);}};
const menu=$('#menu-toggle'),nav=$('#main-nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('is-open',open);if(open)animate(nav,[{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}]);};
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
const mobile=matchMedia('(max-width: 650px)');mobile.addEventListener('change',closeMenu);
let ticking=false;function updateNav(){ticking=false;const sections=['catalog','story','ventures','contact'].map(id=>$('#'+id));const current=sections.filter(s=>s.getBoundingClientRect().top<=150).at(-1);nav.querySelectorAll('a').forEach(a=>{if(current&&a.hash==='#'+current.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});$('header').classList.toggle('scrolled',scrollY>30);}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(updateNav);}},{passive:true});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){animate(e.target,[{opacity:.3,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:320});observer.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.section-head,.values article,.venture-grid article,.story h2,.partner h2').forEach(el=>observer.observe(el));}
reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>a.finish());});
render();$('#count').textContent=selected.length;updateNav();animate($('.hero-copy'),[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:350});
