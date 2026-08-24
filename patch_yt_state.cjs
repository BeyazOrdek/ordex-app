const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const oldStateChange = `function onYoutubePlayerStateChange(event) {
    if (isSyncing || !isYoutubeMode || !isHost) return;
    const currentTime = ytPlayer.getCurrentTime();
    if (event.data === YT.PlayerState.PLAYING) socket.emit('play_video', { room: currentRoom, time: currentTime });
    else if (event.data === YT.PlayerState.PAUSED) socket.emit('pause_video', { room: currentRoom, time: currentTime });
}`;

const newStateChange = `function onYoutubePlayerStateChange(event) {
    if (currentRoomType === 'music') {
        const disc = document.getElementById('music-disc-elem');
        const titleEl = document.getElementById('music-title');
        const artistEl = document.getElementById('music-artist');
        const thumbEl = document.getElementById('music-thumbnail');
        const bgBlurEl = document.getElementById('music-bg-blur');
        
        if (event.data == YT.PlayerState.PLAYING) {
            startMusicProgress();
            if(disc) disc.classList.remove('paused');
            if (ytPlayer && ytPlayer.getVideoData) {
                const data = ytPlayer.getVideoData();
                if (data && data.title) {
                    titleEl.textContent = data.title;
                    artistEl.textContent = data.author || 'YouTube Audio';
                    const videoId = data.video_id;
                    if (videoId) {
                        const thumbUrl = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
                        if(thumbEl) { thumbEl.src = thumbUrl; thumbEl.style.display = 'block'; }
                        if(bgBlurEl) { bgBlurEl.style.backgroundImage = 'url(' + thumbUrl + ')'; }
                    }
                }
            }
        } else {
            if(disc) disc.classList.add('paused');
            if(event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
               // keep progress bar static
            }
        }
    }

    if (isSyncing || !isYoutubeMode || !isHost) return;
    const currentTime = ytPlayer.getCurrentTime();
    if (event.data === YT.PlayerState.PLAYING) socket.emit('play_video', { room: currentRoom, time: currentTime });
    else if (event.data === YT.PlayerState.PAUSED) socket.emit('pause_video', { room: currentRoom, time: currentTime });
}`;

code = code.replace(oldStateChange, newStateChange);

// Make sure handleVideoLoading also triggers it initially if we want to show loading state
fs.writeFileSync('public/script.js', code);
console.log('Patched onYoutubePlayerStateChange');
