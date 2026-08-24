const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

html = html.replace(
  '<div id="music-youtube-container" style="display: none; width: 0; height: 0;">',
  '<div id="music-youtube-container" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; overflow: hidden;">'
);

fs.writeFileSync('public/index.html', html);
console.log('Fixed music iframe visibility');
