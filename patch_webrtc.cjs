const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// 1. In createPeerConnection, add transceiver to force negotiation
code = code.replace(
  "peers[targetSid] = pc;",
  "peers[targetSid] = pc;\n    pc.addTransceiver('audio', { direction: 'recvonly' });"
);

// 2. In requestMicrophonePermission, add tracks to existing peers
const reqMicOld = "monitorAudio(localAudioStream, socket.id);";
const reqMicNew = `monitorAudio(localAudioStream, socket.id);
        Object.values(peers).forEach(pc => {
            localAudioStream.getTracks().forEach(track => {
                const senders = pc.getSenders();
                if (!senders.some(s => s.track && s.track.kind === track.kind)) {
                    pc.addTrack(track, localAudioStream);
                }
            });
        });`;
code = code.replace(reqMicOld, reqMicNew);

// 3. In leaveCurrentRoom, close all peers and tracks
const leaveRoomOld = "currentRoom = '';";
const leaveRoomNew = `currentRoom = '';
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
code = code.replace(leaveRoomOld, leaveRoomNew);

fs.writeFileSync('public/script.js', code);
console.log('Patched webrtc');
