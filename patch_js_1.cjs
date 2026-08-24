const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// Fullscreen Logic
const fullscreenLogic = `
const fullscreenBtn = document.getElementById('fullscreen-btn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        const watchParty = document.getElementById('watch-party-ui');
        const screenShare = document.getElementById('screen-share-ui');
        const musicParty = document.getElementById('music-party-ui');
        
        let elem = null;
        if (currentRoomType === 'watch') elem = watchParty;
        else if (currentRoomType === 'screen') elem = screenShare;
        else if (currentRoomType === 'music') elem = musicParty;
        
        if (elem) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        }
    });
}
`;

code = code.replace(
    "// --- YOUTUBE & VIDEO OYNATICI ---", 
    fullscreenLogic + "\n// --- YOUTUBE & VIDEO OYNATICI ---"
);

fs.writeFileSync('public/script.js', code);
console.log("JS patched 1");
