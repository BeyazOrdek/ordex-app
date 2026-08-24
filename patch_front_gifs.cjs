const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

code = code.split('`<img src="${text}" class="chat-img-attachment">`').join('`<img src="${text}" class="chat-img-attachment" referrerPolicy="no-referrer" crossOrigin="anonymous">`');

const oldChatCheck = "if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif'))))) {";
const newChatCheck = "if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com'))))) {";
code = code.replace(oldChatCheck, newChatCheck);

fs.writeFileSync('public/script.js', code);
console.log('Patched frontend GIF display');
