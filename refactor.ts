import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('src/pages', (filePath) => {
  if (filePath.endsWith('.tsx') && !filePath.includes('Admin')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert old theme to new theme
    content = content.replace(/bg-brand-cream\/50/g, 'bg-brand-black/50');
    content = content.replace(/bg-brand-cream/g, 'bg-brand-charcoal');
    content = content.replace(/text-brand-black\/70/g, 'text-brand-white/70');
    content = content.replace(/text-brand-black\/60/g, 'text-brand-white/60');
    content = content.replace(/text-brand-black\/50/g, 'text-brand-white/50');
    content = content.replace(/text-brand-black\/30/g, 'text-brand-white/30');
    content = content.replace(/border-brand-black\/30/g, 'border-brand-white/30');
    content = content.replace(/border-brand-black\/20/g, 'border-brand-white/20');
    content = content.replace(/border-brand-black\/10/g, 'border-brand-white/10');
    content = content.replace(/border-brand-black/g, 'border-brand-white/20');
    content = content.replace(/text-brand-black/g, 'text-brand-white');
    content = content.replace(/text-\[\#555\]/g, 'text-brand-white/60');
    content = content.replace(/text-\[\#888\]/g, 'text-brand-white/40');
    content = content.replace(/text-\[\#333\]/g, 'text-brand-white/80');

    fs.writeFileSync(filePath, content);
  }
});

walkDir('src/components', (filePath) => {
  if (filePath.endsWith('.tsx') && !filePath.includes('Admin')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // For components
    content = content.replace(/bg-brand-cream\/50/g, 'bg-brand-black/50');
    content = content.replace(/bg-brand-cream/g, 'bg-brand-charcoal');
    content = content.replace(/text-brand-black\/70/g, 'text-brand-white/70');
    content = content.replace(/text-brand-black\/60/g, 'text-brand-white/60');
    content = content.replace(/text-brand-black\/50/g, 'text-brand-white/50');
    content = content.replace(/text-brand-black\/30/g, 'text-brand-white/30');
    content = content.replace(/border-brand-black\/30/g, 'border-brand-white/30');
    content = content.replace(/border-brand-black\/20/g, 'border-brand-white/20');
    content = content.replace(/border-brand-black\/10/g, 'border-brand-white/10');
    content = content.replace(/border-brand-black/g, 'border-brand-white/20');
    content = content.replace(/text-brand-black/g, 'text-brand-white');
    content = content.replace(/text-\[\#555\]/g, 'text-brand-white/60');
    content = content.replace(/text-\[\#888\]/g, 'text-brand-white/40');
    content = content.replace(/text-\[\#333\]/g, 'text-brand-white/80');

    fs.writeFileSync(filePath, content);
  }
});
