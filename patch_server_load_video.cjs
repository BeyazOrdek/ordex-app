const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldNext = "io.to(room).emit('load_video', { videoUrl: next_vid.url });";
const newNext = "io.to(room).emit('load_video', { videoUrl: next_vid.url, requested_by: next_vid.requested_by });";
code = code.replace(oldNext, newNext);

// Wait, what if the host directly loads a video?
const oldLoad = "socket.to(room).emit('load_video', { videoUrl: data.videoUrl });";
const newLoad = "socket.to(room).emit('load_video', { videoUrl: data.videoUrl, requested_by: username });";
code = code.replace(oldLoad, newLoad);

fs.writeFileSync('server.js', code);
console.log('Patched server load_video');
