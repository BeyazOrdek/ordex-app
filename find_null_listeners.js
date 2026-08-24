const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('public/index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const script = fs.readFileSync('public/script.js', 'utf8');

const regex = /([a-zA-Z0-9_]+)\.addEventListener/g;
let match;
const notFound = new Set();
while ((match = regex.exec(script)) !== null) {
    const varName = match[1];
    if (varName === 'document' || varName === 'window' || varName === 'videoPlayer' || varName === 'chatInput' || varName === 'profileAvatarFile' || varName === 'chatFileInput' || varName === 'img') continue;
    // find initialization
    const initRegex = new RegExp(\`const \${varName} = document.getElementById\\('([^']+)'\\)\`);
    const initMatch = script.match(initRegex);
    if (initMatch) {
        const id = initMatch[1];
        if (!document.getElementById(id)) {
            notFound.add(varName + ' (id: ' + id + ')');
        }
    }
}
console.log(Array.from(notFound));
