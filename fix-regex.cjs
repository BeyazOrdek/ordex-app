const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
    /const regExp = \/\^\.\*\(youtu\.be\\\\\/\|v\\\\\/\|u\\\\\/\\\\w\\\\\/\|embed\\\\\/\|watch\\\\?v=\|\\\\&v=\)\(\[^#\\\\&\\\\?\]\*\)\.\*\//,
    "const regExp = /^.*(youtu.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|\\&v=|shorts\\/)([^#\\&\\?]*).*/;"
);

fs.writeFileSync('script.js', code);
