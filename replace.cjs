const fs = require('fs');
const path = require('path');

function replaceInDir(dir, search, replace) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, search, replace);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(search)) {
        fs.writeFileSync(fullPath, content.replace(new RegExp(search, 'g'), replace));
      }
    }
  }
}

replaceInDir('./src', 'JAHAN', 'AMR - FRAGRANCES');
