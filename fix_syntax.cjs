const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

code = code.replace(/\\\`\\\$(\\{emoji\\}) \\\$(\\{users\.size\\})\\\`/g, "`$$$1 $$$2`");
// wait, the easiest way is to just do an exact string replace.
code = code.replace("badge.innerHTML = \\`\\${emoji} \\${users.size}\\`;", "badge.innerHTML = `${emoji} ${users.size}`;");

fs.writeFileSync('public/script.js', code);
console.log("Fixed");
