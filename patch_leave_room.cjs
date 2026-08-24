const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const oldLeave = `function leaveCurrentRoom() {
    if (currentRoom) {
        socket.emit('leave_room_event', {});
        currentRoom = '';
        Object.keys(peers).forEach(sid => {
            if (peers[sid]) peers[sid].close();
            delete peers[sid];
            const audioEl = document.getElementById('audio-' + sid);
            if (audioEl) audioEl.remove();
        });`;
        
const newLeave = `function leaveCurrentRoom() {
    if (currentRoom) {
        // Cleanup Audio/Video
        if (typeof ytPlayer !== 'undefined' && ytPlayer && typeof ytPlayer.stopVideo === 'function') {
            try { ytPlayer.stopVideo(); } catch(e){}
        }
        if (typeof stopMusicProgress === 'function') stopMusicProgress();
        
        if (videoPlayer) {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoPlayer.removeAttribute('src');
            videoPlayer.load();
        }
        
        // Remove all dynamically added remote audio elements
        document.querySelectorAll('audio[id^="audio-"]').forEach(el => {
            el.pause();
            el.removeAttribute('src');
            el.load();
            el.remove();
        });

        socket.emit('leave_room_event', {});
        currentRoom = '';
        Object.keys(peers).forEach(sid => {
            if (peers[sid]) peers[sid].close();
            delete peers[sid];
        });`;

code = code.replace(oldLeave, newLeave);
fs.writeFileSync('public/script.js', code);
console.log('Patched leaveCurrentRoom');
