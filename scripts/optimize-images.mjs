import fs from 'node:fs/promises';
import path from 'node:path';
const sharp = (await import(process.env.TOLDIT_SHARP_PATH || 'sharp')).default;
const root='dist/assets';await fs.mkdir(root+'/responsive',{recursive:true});
const files=(await fs.readdir(root,{recursive:true})).filter(file=>file.endsWith('.webp')&&!file.startsWith('responsive/'));
for(const file of files){const base=file.replace(/\//g,'-').replace(/\.webp$/,'');for(const width of file==='hero.webp'?[480,800,1280]:[480,800])await sharp(path.join(root,file)).resize({width,withoutEnlargement:true}).webp({quality:78,effort:4}).toFile(`${root}/responsive/${base}-${width}.webp`);}
console.log(`Created responsive variants for ${files.length} original assets; originals unchanged.`);
