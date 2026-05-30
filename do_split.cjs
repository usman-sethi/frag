const fs = require('fs');
const path = require('path');

// 1. Create folders
fs.mkdirSync('frontend', { recursive: true });
fs.mkdirSync('backend', { recursive: true });

// 2. Move frontend files
const frontendFiles = ['src', 'public', 'index.html', 'vite.config.ts', 'components.json', 'tsconfig.json'];
frontendFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.renameSync(f, path.join('frontend', f));
  }
});

// 3. Move backend files
const backendFiles = ['server.ts', 'api', '.env', '.env.example'];
backendFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.renameSync(f, path.join('backend', f));
  }
});

console.log("Moved files successfully!");
