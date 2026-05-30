const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content.replace(/\$\$\{/g, 'Rs. ${');
      newContent = newContent.replace(/>\$/g, '>Rs. ');
      newContent = newContent.replace(/"\$"/g, '"Rs. "');
      newContent = newContent.replace(/\$([0-9]+)/g, 'Rs. $1');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
      }
    }
  }
}

replaceInDir('./src');
