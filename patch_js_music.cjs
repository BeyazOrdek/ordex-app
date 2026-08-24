const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const setupOld = `function setupRoomUI(type) {
    currentRoomType = type;
    const discordRoomName = document.getElementById('discord-room-name');
    
    if (discordRoomName) discordRoomName.textContent = currentRoom;

    if (type === 'screen') {
        watchPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.remove('hidden');
        shareScreenBtn.classList.remove('hidden');
    } else if (type === 'discord') {
        watchPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.remove('hidden'); // allow screen share in discord voice
    } else {
        watchPartyUI.classList.remove('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    }
}`;

const setupNew = `function setupRoomUI(type) {
    currentRoomType = type;
    const discordRoomName = document.getElementById('discord-room-name');
    const musicPartyUI = document.getElementById('music-party-ui');
    
    if (discordRoomName) discordRoomName.textContent = currentRoom;

    if (type === 'screen') {
        watchPartyUI.classList.add('hidden');
        if(musicPartyUI) musicPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.remove('hidden');
        shareScreenBtn.classList.remove('hidden');
    } else if (type === 'discord') {
        watchPartyUI.classList.add('hidden');
        if(musicPartyUI) musicPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.remove('hidden');
    } else if (type === 'music') {
        watchPartyUI.classList.add('hidden');
        if(musicPartyUI) musicPartyUI.classList.remove('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    } else {
        watchPartyUI.classList.remove('hidden');
        if(musicPartyUI) musicPartyUI.classList.add('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    }
}`;

code = code.replace(setupOld, setupNew);

const ytOld = `        if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
            ytPlayer.loadVideoById(ytId);
        } else if (ytApiReady) {
            ytPlayer = new YT.Player('yt-player', {
                height: '100%', width: '100%', videoId: ytId,
                playerVars: { 'autoplay': 1, 'controls': isHost ? 1 : 0, 'rel': 0 },
                events: { 'onStateChange': onYoutubePlayerStateChange }
            });
        }`;

const ytNew = `        if (currentRoomType === 'music') {
            document.getElementById('music-title').textContent = 'Müzik Yükleniyor...';
            if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
                ytPlayer.loadVideoById(ytId);
            } else if (ytApiReady) {
                ytPlayer = new YT.Player('music-yt-player', {
                    height: '100%', width: '100%', videoId: ytId,
                    playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0 },
                    events: { 'onStateChange': onYoutubePlayerStateChange }
                });
            }
        } else {
            if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
                ytPlayer.loadVideoById(ytId);
            } else if (ytApiReady) {
                ytPlayer = new YT.Player('yt-player', {
                    height: '100%', width: '100%', videoId: ytId,
                    playerVars: { 'autoplay': 1, 'controls': isHost ? 1 : 0, 'rel': 0 },
                    events: { 'onStateChange': onYoutubePlayerStateChange }
                });
            }
        }`;

code = code.replace(ytOld, ytNew);

const stateChangeOld = `function onYoutubePlayerStateChange(event) {
    if (!isHost) return;`;

const stateChangeNew = `function onYoutubePlayerStateChange(event) {
    if (currentRoomType === 'music') {
        const disc = document.querySelector('.music-disc');
        const titleEl = document.getElementById('music-title');
        if (event.data == YT.PlayerState.PLAYING) {
            if(disc) disc.classList.remove('paused');
            if (ytPlayer && ytPlayer.getVideoData) {
                const data = ytPlayer.getVideoData();
                if (data && data.title) titleEl.textContent = '🎵 ' + data.title;
                else titleEl.textContent = '🎵 Müzik Çalıyor';
            }
        } else {
            if(disc) disc.classList.add('paused');
        }
    }
    
    if (!isHost) return;`;

code = code.replace(stateChangeOld, stateChangeNew);

fs.writeFileSync('public/script.js', code);
console.log("JS patched music");
