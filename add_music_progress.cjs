const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const progressLogic = `
let musicProgressInterval = null;
function startMusicProgress() {
    if (musicProgressInterval) clearInterval(musicProgressInterval);
    musicProgressInterval = setInterval(() => {
        if (currentRoomType === 'music' && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
            const current = ytPlayer.getCurrentTime() || 0;
            const duration = ytPlayer.getDuration() || 0;
            
            const currM = Math.floor(current / 60).toString().padStart(2, '0');
            const currS = Math.floor(current % 60).toString().padStart(2, '0');
            const durM = Math.floor(duration / 60).toString().padStart(2, '0');
            const durS = Math.floor(duration % 60).toString().padStart(2, '0');
            
            const curEl = document.getElementById('music-time-current');
            const totEl = document.getElementById('music-time-total');
            const prog = document.getElementById('music-progress-bar');
            
            if (curEl) curEl.textContent = \`\${currM}:\${currS}\`;
            if (totEl) totEl.textContent = \`\${durM}:\${durS}\`;
            
            if (prog && duration > 0) {
                const perc = (current / duration) * 100;
                prog.style.width = perc + '%';
            }
        }
    }, 1000);
}

function stopMusicProgress() {
    if (musicProgressInterval) {
        clearInterval(musicProgressInterval);
        musicProgressInterval = null;
    }
}
`;

code = code.replace("// --- YOUTUBE & VIDEO OYNATICI ---", progressLogic + "\n// --- YOUTUBE & VIDEO OYNATICI ---");
fs.writeFileSync('public/script.js', code);
console.log('Added music progress logic');
