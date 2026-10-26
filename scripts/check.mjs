import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const files=fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html'));
const manifest=JSON.parse(fs.readFileSync('tests/baseline-manifest.json'));
const baseline=manifest.routes;
for(const file of baseline)assert.ok(fs.existsSync('dist/'+file),`Removed route ${file}`);
assert.equal(createHash('sha256').update(fs.readFileSync('dist/products.js')).digest('hex'),manifest.productsSHA256,'Existing records must be preserved');
const csp=JSON.parse(fs.readFileSync('vercel.json')).headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');let links=0;
for(const file of files){const html=fs.readFileSync(path.join('dist',file),'utf8'),route='/'+file.replace(/index\.html$/,'');
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`One H1: ${file}`);
 assert.ok(html.includes(`rel="canonical" href="https://tolditgroup.com${route}"`),`Canonical: ${file}`);
 assert.ok(sitemap.includes('https://tolditgroup.com'+route),`Sitemap: ${route}`);
 assert.ok(html.includes('/design.css'),`Design system: ${route}`);
 for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)){JSON.parse(match[1]);assert.ok(csp.includes(createHash('sha256').update(match[1]).digest('base64')),`CSP hash: ${route}`)}
 for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){const href=match[1].replaceAll('&amp;','&');if(/^(https?:|mailto:|tel:|data:)/.test(href))continue;const url=new URL(href,'https://tolditgroup.com'+route);let local=path.join('dist',decodeURIComponent(url.pathname));if(url.pathname.endsWith('/'))local=path.join(local,'index.html');assert.ok(fs.existsSync(local),`Missing ${local} from ${file}`);links++}
 for(const match of html.matchAll(/<img\b[^>]*>/g))assert.ok(/\balt="/.test(match[0]),`Missing alt: ${route}`);
}
for(const f of fs.readdirSync('dist').filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync('dist/'+f,'utf8'),{filename:f});
console.log(`PASS: ${files.length} pages, ${baseline.length} preserved routes, 55 unchanged records, ${links} local links/assets, canonical URLs, sitemap, image alt text, JSON-LD/CSP and JavaScript syntax.`);
