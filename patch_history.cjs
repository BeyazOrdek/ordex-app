const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
  "message: r.message, time: r.timestamp }));",
  "message: r.message, time: r.timestamp, read: r.read }));"
);

fs.writeFileSync('server.js', code);
console.log('Patched history');
