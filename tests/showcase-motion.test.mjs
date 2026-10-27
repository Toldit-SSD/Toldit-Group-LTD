import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture() {
  const frames=new Map(),listeners=new Map();let id=0;
  const reduced={matches:false,addEventListener:(_,fn)=>listeners.set('reduced',fn)};
  const compact={matches:false,addEventListener:(_,fn)=>listeners.set('compact',fn)};
  const card=()=>({style:{},cloneNode:()=>card()});
  const ring={clientWidth:1440,children:Array.from({length:8},card),append(item){this.children.push(item)}};
  const label={textContent:''};
  const toggle={hidden:true,attributes:{},setAttribute(name,value){this.attributes[name]=value},querySelector:()=>label,addEventListener:(_,fn)=>listeners.set('click',fn)};
  const scene={dataset:{},classList:{toggle(){}},querySelector:s=>s==='[data-ring]'?ring:toggle};
  const document={hidden:false,querySelector:()=>scene,querySelectorAll:()=>[],addEventListener:(event,fn)=>listeners.set(event,fn)};
  const window={addEventListener:(event,fn)=>listeners.set(event,fn)};
  vm.runInNewContext(fs.readFileSync('dist/showcase.js','utf8'),{document,window,HTMLImageElement:class{},navigator:{hardwareConcurrency:8,deviceMemory:8},CSS:{supports:()=>true},matchMedia:q=>q.includes('prefers-reduced-motion')?reduced:compact,requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:id=>frames.delete(id)});
  return {scene,toggle,reduced,document,frames,listeners,frame(time=100){const [key,fn]=frames.entries().next().value;frames.delete(key);fn(time)}};
}

test('a frame synchronizes reduced-motion UI even before its change event arrives',()=>{
 const f=fixture();assert.equal(f.scene.dataset.motion,'running');f.reduced.matches=true;f.frame();
 assert.equal(f.scene.dataset.motion,'paused');assert.equal(f.toggle.hidden,true);assert.equal(f.frames.size,0);
});
test('manual pause survives reduced-motion changes and visibility restoration',()=>{
 const f=fixture();f.listeners.get('click')();assert.equal(f.scene.dataset.motion,'paused');
 f.reduced.matches=true;f.listeners.get('reduced')();f.reduced.matches=false;f.listeners.get('reduced')();
 f.document.hidden=true;f.listeners.get('visibilitychange')();f.document.hidden=false;f.listeners.get('visibilitychange')();
 assert.equal(f.frames.size,0);assert.equal(f.toggle.attributes['aria-pressed'],'true');
 f.listeners.get('click')();assert.equal(f.scene.dataset.motion,'running');assert.equal(f.frames.size,1);
});
