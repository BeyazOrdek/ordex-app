const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

code = code.replace(
`socket.on('play_video', (data) => {
    isSyncing = true;
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
        ytPlayer.playVideo();
    } else if (!isYoutubeMode) {
        if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
        videoPlayer.play().catch(() => {});
    }
    setTimeout(() => { isSyncing = false; }, 600);
});`,
`socket.on('play_video', (data) => {
    const tryPlay = (attempts) => {
        isSyncing = true;
        if (isYoutubeMode) {
            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
                if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
                ytPlayer.playVideo();
                setTimeout(() => { isSyncing = false; }, 600);
            } else if (attempts > 0) {
                setTimeout(() => tryPlay(attempts - 1), 500);
            } else {
                setTimeout(() => { isSyncing = false; }, 600);
            }
        } else {
            if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
            videoPlayer.play().catch(() => {});
            setTimeout(() => { isSyncing = false; }, 600);
        }
    };
    tryPlay(10); // retry up to 5 seconds
});`
);

code = code.replace(
`socket.on('pause_video', (data) => {
    isSyncing = true;
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
        if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
    } else if (!isYoutubeMode) {
        videoPlayer.pause();
        if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
    }
    setTimeout(() => { isSyncing = false; }, 600);
});`,
`socket.on('pause_video', (data) => {
    const tryPause = (attempts) => {
        isSyncing = true;
        if (isYoutubeMode) {
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
                ytPlayer.pauseVideo();
                if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
                setTimeout(() => { isSyncing = false; }, 600);
            } else if (attempts > 0) {
                setTimeout(() => tryPause(attempts - 1), 500);
            } else {
                setTimeout(() => { isSyncing = false; }, 600);
            }
        } else {
            videoPlayer.pause();
            if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
            setTimeout(() => { isSyncing = false; }, 600);
        }
    };
    tryPause(10);
});`
);

fs.writeFileSync('script.js', code);
