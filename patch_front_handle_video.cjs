const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const oldHandle = `function handleVideoLoading(url) {
    const ytId = extractYouTubeId(url);`;
    
const newHandle = `function handleVideoLoading(url, requestedBy = myUsername) {
    const ytId = extractYouTubeId(url);
    if (currentRoomType === 'music') {
        const addedByEl = document.getElementById('music-added-by');
        if (addedByEl) {
            addedByEl.innerHTML = \`👤 <span style="color: var(--neon-cyan);">\${requestedBy}</span> tarafından istendi\`;
        }
    }`;

code = code.replace(oldHandle, newHandle);

const oldOnLoad = "socket.on('load_video', (data) => handleVideoLoading(data.videoUrl));";
const newOnLoad = "socket.on('load_video', (data) => handleVideoLoading(data.videoUrl, data.requested_by));";
code = code.replace(oldOnLoad, newOnLoad);

fs.writeFileSync('public/script.js', code);
console.log('Patched handleVideoLoading');
