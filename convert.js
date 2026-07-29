const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// A very naive regex to remove basic type annotations
// But wait, there are tools to strip types. We can use esbuild or ts-node.
