const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// I will just add a global document listener for image errors (error events don't bubble, so we must use capturing phase)
const globalErrorLogic = `
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
        if (!e.target.dataset.fallbackApplied) {
            e.target.dataset.fallbackApplied = "true";
            e.target.src = '/logo.png'; // Fallback
        }
    }
}, true);
`;

if (!code.includes('e.target.dataset.fallbackApplied')) {
    code = globalErrorLogic + "\n" + code;
    fs.writeFileSync('public/script.js', code);
    console.log('Added global image error fallback');
}
