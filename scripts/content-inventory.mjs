import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const hash = value => createHash('sha256').update(value).digest('hex');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1],m[2]]));
const text = html => html.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/g,'').split(/<[^>]+>/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean);
const root = 'dist';
function inventory() {
 const files = fs.readdirSync(root,{recursive:true}).filter(f=>f.endsWith('.html')).sort();
 const code=fs.readFileSync('dist/products.js','utf8');
 const pages=files.map(file=>{
  const html=fs.readFileSync(path.join(root,file),'utf8'),head=html.match(/<head[^>]*>([\s\S]*?)<\/head>/)[1],main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  return {route:'/'+file.replace(/index\.html$/,''),title:head.match(/<title>([\s\S]*?)<\/title>/)[1],metadata:[...head.matchAll(/<meta\b[^>]+>/g)].map(m=>attrs(m[0])),canonical:[...head.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)].map(m=>attrs(m[0])),structuredData:[...head.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])),text:text(main),links:[...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>/g)].map(m=>m[1]).filter(h=>h&&!h.startsWith('#')).sort(),images:[...html.matchAll(/<img\b[^>]*>/g)].map(m=>{const a=attrs(m[0]);return {src:a.src,alt:a.alt}}),fields:[...html.matchAll(/<(input|select|textarea|option)\b[^>]*>/g)].map(m=>({tag:m[1],...attrs(m[0])}))};
 });
 const protectedFiles=['dist/products.js','dist/analytics.js','dist/page.js','dist/contact.js','dist/inquiry-core.js','dist/catalog-core.js','dist/sitemap.xml','dist/robots.txt','dist/favicon.svg',...fs.readdirSync('dist/assets',{recursive:true}).filter(f=>!fs.statSync('dist/assets/'+f).isDirectory()).map(f=>'dist/assets/'+f),...fs.readdirSync('dist/fonts').map(f=>'dist/fonts/'+f),...fs.readdirSync('src/pages',{recursive:true}).filter(f=>f.endsWith('.html')).map(f=>'src/pages/'+f)];
 return {baseline:'a59440e',productsSHA256:hash(code),products:vm.runInNewContext(code+'\nPRODUCTS'),pages,protectedFiles:Object.fromEntries(protectedFiles.map(f=>[f,hash(fs.readFileSync(f))]))};
}
const baselineFile='tests/showcase-content-baseline.json';
if(process.argv.includes('--write')) {assert.ok(!fs.existsSync(baselineFile),'Do not overwrite the content baseline');fs.writeFileSync(baselineFile,JSON.stringify(inventory(),null,2)+'\n');console.log('Captured complete before inventory.');}
else {
 const before=JSON.parse(fs.readFileSync(baselineFile)),after=inventory();
 assert.equal(after.productsSHA256,before.productsSHA256,'Product record bytes changed');
 for(const [file,digest] of Object.entries(before.protectedFiles))assert.equal(after.protectedFiles[file],digest,`Protected content changed: ${file}`);
 for(const page of before.pages){const actual=after.pages.find(p=>p.route===page.route);assert.ok(actual,`Missing route ${page.route}`);for(const key of ['title','metadata','canonical','structuredData','fields'])assert.deepEqual(actual[key],page[key],`${key} changed: ${page.route}`);
  for(const segment of page.text)assert.ok(actual.text.includes(segment),`Lost content on ${page.route}: ${segment}`);
  if(page.route!=='/')assert.deepEqual(actual.text,page.text,`Page text changed: ${page.route}`);
  for(const link of new Set(page.links))assert.ok(actual.links.includes(link),`Link lost: ${page.route} → ${link}`);
  for(const image of page.images)assert.ok(actual.images.some(i=>i.src===image.src&&i.alt===image.alt),`Image or alt text lost: ${page.route} ${image.src}`);
 }
 console.log(`PASS content preservation: ${after.pages.length} routes; ${after.products.length} exact records; all original main-content text, metadata, structured data, links, forms, images and ${Object.keys(before.protectedFiles).length} protected file hashes retained.`);
}
