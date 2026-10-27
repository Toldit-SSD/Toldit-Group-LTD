const {chromium}=await import(process.env.TOLDIT_PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const report=[];
async function test(name,fn){try{await fn();report.push({name,pass:true});console.log('PASS',name)}catch(error){report.push({name,pass:false,error:error.stack});console.log('FAIL',name,error.message)}}
const ctx=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8});Object.defineProperty(navigator,'deviceMemory',{get:()=>8});localStorage.setItem('toldit-analytics-consent-v2','declined');});
const page=await ctx.newPage();page.setDefaultTimeout(5000);
const base=(process.env.TOLDIT_PREVIEW_URL || 'http://127.0.0.1:4174').replace(/\/$/,'')+'/';
const motion=state=>page.waitForFunction(expected=>document.querySelector('[data-showcase]').dataset.motion===expected,state);
const style=()=>page.locator('[data-ring-card]').first().getAttribute('style');
await test('Pause button receives clicks across desktop widths',async()=>{
 for(const width of [901,920,1024,1280,1440,1920]){
  await page.setViewportSize({width,height:1000});await page.goto(base);await page.locator('[data-motion-toggle]').waitFor({state:'visible'});await page.locator('[data-motion-toggle]').scrollIntoViewIfNeeded();
  const result=await page.locator('[data-motion-toggle]').evaluate(b=>{const r=b.getBoundingClientRect();const top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{width:innerWidth,receives:b.contains(top),hit:top?.className}});
  assert.ok(result.receives,JSON.stringify(result));await page.locator('[data-motion-toggle]').click();assert.equal(await page.locator('[data-motion-toggle]').getAttribute('aria-pressed'),'true');
 }
});
await test('Reduced motion changes and manual pause/resume settle correctly',async()=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto(base);await motion('running');const a=await style();await page.waitForFunction(before=>document.querySelector('[data-ring-card]').getAttribute('style')!==before,a);
 await page.locator('[data-motion-toggle]').click();await motion('paused');const paused=await style();await page.waitForTimeout(200);assert.equal(await style(),paused);
 await page.locator('[data-motion-toggle]').click();await motion('running');
 for(let repeat=0;repeat<3;repeat++){
  await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-motion-toggle]').waitFor({state:'hidden'});await motion('paused');const before=await style();await page.waitForTimeout(200);assert.equal(await style(),before);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('[data-motion-toggle]').waitFor({state:'visible'});await motion('running');
 }
});
await test('Offscreen motion stops and resumes on return',async()=>{
 await page.locator('#catalog').scrollIntoViewIfNeeded();await motion('paused');const before=await style();await page.waitForTimeout(200);assert.equal(await style(),before);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await motion('running');
});
await test('Background visibility boundary suspends animation (browser fixture)',async()=>{
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});await motion('paused');const before=await style();await page.waitForTimeout(200);assert.equal(await style(),before);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await motion('running');
});
await test('Touch and constrained devices use non-animated alternatives',async()=>{
 for(const config of [{viewport:{width:768,height:1024},isMobile:true,hasTouch:true},{viewport:{width:1440,height:1000},constrained:true}]){
  const {constrained,...settings}=config;const c=await browser.newContext({...settings,reducedMotion:'no-preference'});await c.addInitScript(low=>{Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>low?2:8});Object.defineProperty(navigator,'deviceMemory',{get:()=>low?2:8});localStorage.setItem('toldit-analytics-consent-v2','declined');},Boolean(constrained));const p=await c.newPage();await p.goto(base);await p.waitForFunction(()=>document.querySelector('[data-showcase]').dataset.motion==='paused');assert.equal(await p.locator('[data-motion-toggle]').isVisible(),false);assert.equal(await p.locator('.showcase-product-nav a').count(),8);await c.close();
 }
});
await test('Failed original product images retain their accessible alt fallback',async()=>{
 const c=await browser.newContext({viewport:{width:390,height:844}});await c.route('**/assets/**',r=>r.fulfill({status:404,body:''}));const p=await c.newPage();await p.goto(base+'products/honey/');await p.waitForLoadState('networkidle');const image=p.locator('main figure img').first();assert.ok((await image.getAttribute('alt')).length>0);assert.equal(await image.evaluate(i=>getComputedStyle(i).visibility),'visible');await c.close();
});
await browser.close();if(process.env.TOLDIT_QA_REPORT) await fs.writeFile(process.env.TOLDIT_QA_REPORT,JSON.stringify(report,null,2));if(report.some(r=>!r.pass))process.exitCode=1;
