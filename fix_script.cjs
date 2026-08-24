const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// The incorrect block starts with "let currentRoom = '';\n        Object.keys(peers).forEach("
// Let's replace the bad insertion at the top.
const badInsertion = `let currentRoom = '';
        Object.keys(peers).forEach(sid => {
            if (peers[sid]) peers[sid].close();
            delete peers[sid];
            const audioEl = document.getElementById('audio-' + sid);
            if (audioEl) audioEl.remove();
        });
        if (localAudioStream) {
            localAudioStream.getTracks().forEach(t => t.stop());
            localAudioStream = null;
            micToggleBtn.textContent = '🎙️ Sesi Aç';
            const profileMicBtn = document.getElementById('profile-mic-btn');
            if(profileMicBtn) profileMicBtn.innerHTML = '🎙️';
        }
        if (localScreenStream) {
            localScreenStream.getTracks().forEach(t => t.stop());
            localScreenStream = null;
        }`;

code = code.replace(badInsertion, "let currentRoom = '';");

// Now apply it properly to leaveCurrentRoom
const targetFunctionOld = `function leaveCurrentRoom() {
    if (currentRoom) {
        socket.emit('leave_room_event', {});
        currentRoom = '';
        switchMainView('friends');`;

const targetFunctionNew = `function leaveCurrentRoom() {
    if (currentRoom) {
        socket.emit('leave_room_event', {});
        currentRoom = '';
        Object.keys(peers).forEach(sid => {
            if (peers[sid]) peers[sid].close();
            delete peers[sid];
            const audioEl = document.getElementById('audio-' + sid);
            if (audioEl) audioEl.remove();
        });
        if (localAudioStream) {
            localAudioStream.getTracks().forEach(t => t.stop());
            localAudioStream = null;
            micToggleBtn.textContent = '🎙️ Sesi Aç';
            const profileMicBtn = document.getElementById('profile-mic-btn');
            if(profileMicBtn) profileMicBtn.innerHTML = '🎙️';
        }
        if (localScreenStream) {
            localScreenStream.getTracks().forEach(t => t.stop());
            localScreenStream = null;
        }
        switchMainView('friends');`;

code = code.replace(targetFunctionOld, targetFunctionNew);

fs.writeFileSync('public/script.js', code);
console.log("Fixed");
