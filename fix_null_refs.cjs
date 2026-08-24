const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

code = code.replace(
    "embedResizeBtn.addEventListener('click', () => {",
    "if (embedResizeBtn) embedResizeBtn.addEventListener('click', () => {"
);

code = code.replace(
    "callResizeHandle.addEventListener('mousedown', (e) => {",
    "if (callResizeHandle) callResizeHandle.addEventListener('mousedown', (e) => {"
);

fs.writeFileSync('public/script.js', code);
console.log("Fixed null refs");
