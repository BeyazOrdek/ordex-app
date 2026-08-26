// =========================================================================
// ÖRDEX SİBERPUNK PLATFORM - ANA İSTEMCİ SCRIPTI (TEK VE TEMİZ MİMARİ)
// =========================================================================

window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
        if (!e.target.dataset.fallbackApplied) {
            e.target.dataset.fallbackApplied = "true";
            e.target.src = '/logo.png';
        }
    }
}, true);

const socket = io();

// --- DOM ELEMANLARI ---
const authView = document.getElementById('auth-view');
const appLayout = document.getElementById('app-layout');
const mainContent = document.getElementById('main-content');
const friendsView = document.getElementById('friends-view');
const roomView = document.getElementById('room-view');

const authUsernameInput = document.getElementById('auth-username');
const authPasswordInput = document.getElementById('auth-password');
const passwordGroup = document.getElementById('password-group');
const authActionBtn = document.getElementById('auth-action-btn');
const authMessage = document.getElementById('auth-message');

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const tabGuest = document.getElementById('tab-guest');

// Sol Bar & Sunucu / Oda Listesi
const homeDmBtn = document.getElementById('home-dm-btn');
const sidebarRoomsList = document.getElementById('sidebar-rooms-list');
const createRoomModalBtn = document.getElementById('create-room-modal-btn');

const tabFriendsAll = document.getElementById('tab-friends-all');
const tabFriendsOnline = document.getElementById('tab-friends-online');
const tabGroupsList = document.getElementById('tab-groups-list');
const tabFriendsAdd = document.getElementById('tab-friends-add');

const addFriendContainer = document.getElementById('add-friend-container');
const addFriendInput = document.getElementById('add-friend-input');
const addFriendBtn = document.getElementById('add-friend-btn');
const groupActionsBar = document.getElementById('group-actions-bar');
const openCreateGroupBtn = document.getElementById('open-create-group-btn');
const friendsListContainer = document.getElementById('friends-list-container');

// Hızlı Hesap Değiştirme (Account Switcher)
const openAccountSwitchBtn = document.getElementById('open-account-switch-btn');
const accountSwitcherMenu = document.getElementById('account-switcher-menu');
const savedAccountsList = document.getElementById('saved-accounts-list');
const addNewAccountBtn = document.getElementById('add-new-account-btn');

// Alt Profil Barı & Durum Göstergesi
const myProfileTrigger = document.getElementById('my-profile-trigger');
const myProfileNameTrigger = document.getElementById('my-profile-name-trigger');
const myAvatarDisplay = document.getElementById('my-avatar-display');
const myDisplayNameEl = document.getElementById('my-display-name');
const myUsernameTagEl = document.getElementById('my-username-tag');
const profileMicBtn = document.getElementById('profile-mic-btn');
const profileDeafenBtn = document.getElementById('profile-deafen-btn');
const openProfileBtn = document.getElementById('open-profile-modal-btn') || document.getElementById('open-profile-btn');
const myStatusIndicator = document.getElementById('my-status-indicator');
const statusSwitcherMenu = document.getElementById('status-switcher-menu');

// Friends Dashboard & DM Chat
const friendsDashboard = document.getElementById('friends-dashboard');
const friendsCountBadge = document.getElementById('friends-count-badge');
const friendsCardsGrid = document.getElementById('friends-cards-grid');

const dmChatContainer = document.getElementById('dm-chat-container');
const dmHeaderAvatar = document.getElementById('dm-header-avatar');
const pmTargetDisplayname = document.getElementById('pm-target-displayname');
const pmTargetUsernameTag = document.getElementById('pm-target-username-tag');
const pmTargetStatusDot = document.getElementById('pm-target-status-dot');

const pmMessagesContainer = document.getElementById('pm-messages-container');
const pmInput = document.getElementById('pm-input');
const pmSendBtn = document.getElementById('pm-send-btn');
const startVoiceCallBtn = document.getElementById('start-voice-call-btn');
const startVideoCallBtn = document.getElementById('start-video-call-btn');
const toggleRightSidebarBtn = document.getElementById('toggle-right-sidebar-btn');

const chatDropZone = document.getElementById('chat-drop-zone');
const chatDragOverlay = document.getElementById('chat-drag-overlay');
const chatFileInput = document.getElementById('chat-file-input');
const attachFileBtn = document.getElementById('attach-file-btn');

const openGifBtn = document.getElementById('open-gif-btn');
const gifPickerModal = document.getElementById('gif-picker-modal');
const gifSearchInput = document.getElementById('gif-search-input');
const gifResultsGrid = document.getElementById('gif-results-grid');
const closeGifModalBtn = document.getElementById('close-gif-modal-btn');
const openProfileGifBtn = document.getElementById('open-profile-gif-btn');
const gifSearchBtn = document.getElementById('gif-search-btn');

const dmRightSidebar = document.getElementById('dm-right-sidebar');
const rightSidebarMembersList = document.getElementById('right-sidebar-members-list');

// DM Arama Elemanları
const embeddedDmCall = document.getElementById('embedded-dm-call');
const embedResizeBtn = document.getElementById('embed-resize-btn');
const callResizeHandle = document.getElementById('call-resize-handle');
const embeddedCallName = document.getElementById('embedded-call-name');
const callRemoteAvatar = document.getElementById('call-remote-avatar');
const callRemoteName = document.getElementById('call-remote-name');
const callLocalAvatar = document.getElementById('call-local-avatar');

const localDmVideo = document.getElementById('local-dm-video');
const remoteDmVideo = document.getElementById('remote-dm-video');
const remoteDmAudio = document.getElementById('remote-dm-audio');

const embedToggleMicBtn = document.getElementById('embed-toggle-mic-btn');
const embedToggleCamBtn = document.getElementById('embed-toggle-cam-btn');
const embedEndCallBtn = document.getElementById('embed-end-call-btn');

const activeCallStrip = document.getElementById('active-call-strip');
const callStripText = document.getElementById('call-strip-text');
const callStripMicBtn = document.getElementById('call-strip-mic-btn');
const callStripReturnBtn = document.getElementById('call-strip-return-btn');
const callStripEndBtn = document.getElementById('call-strip-end-btn');

// Oda Görünümü & Medya Kontrolleri
const currentRoomDisplay = document.getElementById('current-room');
const roleBadge = document.getElementById('role-badge');
const leaveRoomBtn = document.getElementById('leave-room-btn');
const watchPartyUI = document.getElementById('watch-party-ui');
const musicPartyUI = document.getElementById('music-party-ui');
const screenShareUI = document.getElementById('screen-share-ui');
const videoControlsBar = document.getElementById('video-controls-bar');
const queueSectionBox = document.getElementById('queue-section-box');
const noScreenMsg = document.getElementById('no-screen-msg');

const videoUrlInput = document.getElementById('video-url');
const loadVideoBtn = document.getElementById('load-video-btn');
const nextVideoBtn = document.getElementById('next-video-btn');
const queueListContainer = document.getElementById('queue-list-container');
const videoPlayer = document.getElementById('video-player');
const youtubeContainer = document.getElementById('youtube-container');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Özel Medya Kontrol Paneli Elemanları
const mediaPlayPauseBtn = document.getElementById('media-play-pause-btn');
const mediaSeekBar = document.getElementById('media-seek-bar');
const mediaTimeCurrent = document.getElementById('media-time-current');
const mediaTimeTotal = document.getElementById('media-time-total');
const mediaVolumeBar = document.getElementById('media-volume-bar');
const mediaMuteBtn = document.getElementById('media-mute-btn');

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const micToggleBtn = document.getElementById('mic-toggle-btn');
const shareScreenBtn = document.getElementById('share-screen-btn');
const voiceUsersList = document.getElementById('voice-users-list');
const voiceConnectionCard = document.getElementById('voice-connection-card');
const voiceConnChannelName = document.getElementById('voice-conn-channel-name');
const disconnectVoiceBtn = document.getElementById('disconnect-voice-btn');

// Modallar
const joinRoomModal = document.getElementById('join-room-modal');
const joinRoomModalText = document.getElementById('join-room-modal-text');
const confirmJoinRoomBtn = document.getElementById('confirm-join-room-btn');
const cancelJoinRoomBtn = document.getElementById('cancel-join-room-btn');

const createRoomModal = document.getElementById('create-room-modal');
const newRoomNameInput = document.getElementById('new-room-name');
const newRoomTypeSelect = document.getElementById('new-room-type');
const createRoomBtn = document.getElementById('create-room-btn');
const closeCreateRoomBtn = document.getElementById('close-create-room-btn');

const createGroupModal = document.getElementById('create-group-modal');
const newGroupNameInput = document.getElementById('new-group-name');
const groupFriendsCheckboxList = document.getElementById('group-friends-checkbox-list');
const submitCreateGroupBtn = document.getElementById('submit-create-group-btn');
const closeCreateGroupBtn = document.getElementById('close-create-group-btn');
let selectedGroupAvatar = '👥';

const profileModal = document.getElementById('profile-modal');
const tabProfGen = document.getElementById('tab-prof-gen');
const tabProfDecor = document.getElementById('tab-prof-decor');
const tabProfAdmin = document.getElementById('tab-prof-admin');
const tabProfAudio = document.getElementById('tab-prof-audio');
const tabProfTheme = document.getElementById('tab-prof-theme');

const sectionProfGen = document.getElementById('section-prof-gen');
const sectionProfDecor = document.getElementById('section-prof-decor');
const sectionProfAdmin = document.getElementById('section-prof-admin');
const sectionProfAudio = document.getElementById('section-prof-audio');
const sectionProfTheme = document.getElementById('section-prof-theme');

const previewCardBanner = document.getElementById('preview-card-banner');
const previewAvatarContainer = document.getElementById('preview-avatar-container');
const previewDisplayName = document.getElementById('preview-display-name');
const previewUserTag = document.getElementById('preview-user-tag');
const previewBadgesRow = document.getElementById('preview-badges-row');
const previewAboutText = document.getElementById('preview-about-text');

const profileAvatarFile = document.getElementById('profile-avatar-file');
const profileAvatarUrlInput = document.getElementById('profile-avatar-url-input');
const profileBannerUrlInput = document.getElementById('profile-banner-url-input');
const avatarZoomSlider = document.getElementById('avatar-zoom-slider');
const avatarFitSelect = document.getElementById('avatar-fit-select');

const profileDisplaynameInput = document.getElementById('profile-displayname-input');
const profileCustomstatusInput = document.getElementById('profile-customstatus-input');
const profileAboutInput = document.getElementById('profile-about-input');

const adminTargetUserInput = document.getElementById('admin-target-user-input');
const adminAssignBadgeBtn = document.getElementById('admin-assign-badge-btn');

const settingMicDevice = document.getElementById('setting-mic-device');
const settingAudioDevice = document.getElementById('setting-audio-device');
const settingOutputVolume = document.getElementById('setting-output-volume');
const settingMicVolume = document.getElementById('setting-mic-volume');

const settingNoiseSuppression = document.getElementById('setting-noise-suppression');
const settingEchoCancellation = document.getElementById('setting-echo-cancellation');
const settingAutoGain = document.getElementById('setting-auto-gain');

const saveProfileBtn = document.getElementById('save-profile-btn');
const closeProfileBtn = document.getElementById('close-profile-btn');

const incomingCallModal = document.getElementById('incoming-call-modal');
const incomingCallerName = document.getElementById('incoming-caller-name');
const incomingCallAvatar = document.getElementById('incoming-call-avatar');
const incomingCallTypeText = document.getElementById('incoming-call-type-text');
const acceptCallBtn = document.getElementById('accept-call-btn');
const rejectCallBtn = document.getElementById('reject-call-btn');

// --- UYGULAMA DURUMU (GLOBAL STATE) ---
let myUsername = '';
let myDisplayName = '';
let myAvatar = '🎮';
let myAbout = 'Siberpunk platform sakini.';
let myAvatarFrame = 'none';
let myProfileBanner = 'linear-gradient(135deg, #00f0ff, #8a2be2)';
let myCustomStatus = '';
let myBadges = '⚡,🎮';
let myIsAdmin = 0;
let currentTheme = localStorage.getItem('ordex_theme') || 'theme-cyan';
let myStatus = localStorage.getItem('ordex_user_status') || 'online';

let currentRoom = '';
let currentRoomType = 'watch';
let pendingJoinRoom = null;

let isSyncing = false;
let authMode = 'login';
let isYoutubeMode = false;
let ytPlayer = null;
let ytApiReady = false;
let pendingVideoLoad = null;
let isHost = false;
let isScreenSharing = false;

let isUserSeeking = false;
let mediaVolume = 1;
let isMediaMuted = false;

let currentPmTarget = null;
let currentChatType = 'dm';
let currentGroupObj = null;

let activeFriendsList = [];
let activeGroupsList = [];
let friendsFilter = 'all';
let unreadMessages = {};

// DM WebRTC Arama Durumu
let dmPeerConnection = null;
let localDmStream = null;
let dmCallTarget = null;
let dmCallType = 'voice';
let incomingCallData = null;
let isInCall = false;

// Oda WebRTC & Mesh Voice Management
let localAudioStream = null;
let localScreenStream = null;
const peers = {};
const pendingCandidates = {};
const pendingAudioElements = new Set();
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};
let audioContext;
let micGainNode;

// Bildirim Sesleri
const notifAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playNotifSound(type) {
    const enableSounds = document.getElementById('setting-enable-sounds');
    if (enableSounds && !enableSounds.checked) return;
    if (notifAudioCtx.state === 'suspended') notifAudioCtx.resume();
    
    const osc = notifAudioCtx.createOscillator();
    const gain = notifAudioCtx.createGain();
    osc.connect(gain);
    gain.connect(notifAudioCtx.destination);
    
    if (type === 'message') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, notifAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, notifAudioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, notifAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, notifAudioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(notifAudioCtx.currentTime + 0.2);
    } else if (type === 'join') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, notifAudioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, notifAudioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, notifAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, notifAudioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(notifAudioCtx.currentTime + 0.3);
    } else if (type === 'call') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, notifAudioCtx.currentTime);
        osc.frequency.setValueAtTime(554, notifAudioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, notifAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, notifAudioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(notifAudioCtx.currentTime + 0.4);
    }
}

// --- AVATAR VE TEMA YARDIMCILARI ---
function renderAvatar(avatarData, frame = 'none', zoomLevel = 1, fitMode = 'cover') {
    if (!avatarData) avatarData = '🎮';
    const frameClass = frame && frame !== 'none' ? ` ${frame}` : '';
    if (avatarData.startsWith('data:image') || avatarData.startsWith('http')) {
        return `<div class="user-avatar-inner${frameClass}"><img src="${avatarData}" style="transform: scale(${zoomLevel}); object-fit: ${fitMode};"></div>`;
    }
    return `<div class="user-avatar-inner${frameClass}">${avatarData}</div>`;
}

function applyTheme(themeName) {
    currentTheme = themeName;
    document.body.className = themeName;
    localStorage.setItem('ordex_theme', themeName);
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
}
applyTheme(currentTheme);

document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

// =========================================================================
// YOUTUBE IFRAME PLAYER API ENTEGRASYONU (controls: 0 & Custom UI)
// =========================================================================

window.onYouTubeIframeAPIReady = function() {
    ytApiReady = true;
    if (pendingVideoLoad) {
        const { url, requestedBy } = pendingVideoLoad;
        pendingVideoLoad = null;
        handleVideoLoading(url, requestedBy);
    }
};

function extractYouTubeId(url) {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|watch|shorts)\/|.*[?&]v=)|music\.youtube\.com\/watch\?v=|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

function createYouTubePlayer(targetDivId, videoId) {
    // Önceki oyuncuyu temizle
    if (ytPlayer && typeof ytPlayer.destroy === 'function') {
        try { ytPlayer.destroy(); } catch(e) {}
        ytPlayer = null;
    }

    try {
        ytPlayer = new YT.Player(targetDivId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'controls': 0, // YouTube'un kendi kontrollerini tamamen gizle!
                'disablekb': 1,
                'rel': 0,
                'modestbranding': 1,
                'playsinline': 1,
                'enablejsapi': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': (event) => {
                    const iframe = event.target.getIframe();
                    if (iframe) {
                        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen');
                    }
                    try { event.target.playVideo(); } catch(e) {}
                    updateMediaUIPlayState(true);
                },
                'onStateChange': onYoutubePlayerStateChange
            }
        });
    } catch(err) {
        console.error('YouTube Player oluşturulamadı:', err);
    }
}

function handleVideoLoading(url, requestedBy = myUsername) {
    const ytId = extractYouTubeId(url);
    
    if (currentRoomType === 'music') {
        const addedByEl = document.getElementById('music-added-by');
        if (addedByEl) {
            addedByEl.innerHTML = `👤 <span style="color: var(--neon-cyan);">${requestedBy}</span> tarafından istendi`;
        }
    }

    if (ytId) {
        isYoutubeMode = true;
        if (videoPlayer) {
            videoPlayer.style.display = 'none';
            videoPlayer.pause();
        }
        if (youtubeContainer) youtubeContainer.style.display = 'block';

        if (currentRoomType === 'music') {
            const titleEl = document.getElementById('music-title');
            if (titleEl) titleEl.textContent = 'Müzik Yükleniyor...';
        }

        if (!ytApiReady && !(window.YT && window.YT.Player)) {
            pendingVideoLoad = { url, requestedBy };
            return;
        }

        const containerId = (currentRoomType === 'music') ? 'music-yt-player' : 'yt-player';
        
        // Eğer oyuncu zaten varsa sadece video ID'sini yükle
        if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
            try {
                ytPlayer.loadVideoById(ytId);
                updateMediaUIPlayState(true);
                return;
            } catch(e) {}
        }
        
        // Yeniden oluştur
        createYouTubePlayer(containerId, ytId);
    } else {
        isYoutubeMode = false;
        if (youtubeContainer) youtubeContainer.style.display = 'none';
        if (videoPlayer) {
            videoPlayer.style.display = 'block';
            videoPlayer.src = url;
            videoPlayer.load();
            videoPlayer.play().catch(() => {});
            updateMediaUIPlayState(true);
        }
    }
}

function onYoutubePlayerStateChange(event) {
    if (currentRoomType === 'music') {
        const disc = document.getElementById('music-disc-elem');
        const titleEl = document.getElementById('music-title');
        const artistEl = document.getElementById('music-artist');
        const thumbEl = document.getElementById('music-thumbnail');
        const bgBlurEl = document.getElementById('music-bg-blur');
        
        if (event.data == YT.PlayerState.PLAYING) {
            if (disc) disc.classList.remove('paused');
            if (ytPlayer && ytPlayer.getVideoData) {
                const data = ytPlayer.getVideoData();
                if (data && data.title) {
                    if (titleEl) titleEl.textContent = data.title;
                    if (artistEl) artistEl.textContent = data.author || 'YouTube Audio';
                    const videoId = data.video_id;
                    if (videoId) {
                        const thumbUrl = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
                        if (thumbEl) { thumbEl.src = thumbUrl; thumbEl.style.display = 'block'; }
                        if (bgBlurEl) { bgBlurEl.style.backgroundImage = 'url(' + thumbUrl + ')'; }
                    }
                }
            }
            updateMediaUIPlayState(true);
        } else {
            if (disc) disc.classList.add('paused');
            if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                updateMediaUIPlayState(false);
            }
        }
    }

    if (isSyncing || !isYoutubeMode) return;
    const currentTime = ytPlayer ? ytPlayer.getCurrentTime() : 0;
    if (event.data === YT.PlayerState.PLAYING) {
        updateMediaUIPlayState(true);
        socket.emit('play_video', { room: currentRoom, time: currentTime });
    } else if (event.data === YT.PlayerState.PAUSED) {
        updateMediaUIPlayState(false);
        socket.emit('pause_video', { room: currentRoom, time: currentTime });
    }
}

// --- ÖZEL KONTROL BARI METOTLARI & EVENT LISTENERLARI ---
function getMediaCurrentTime() {
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
        return ytPlayer.getCurrentTime() || 0;
    } else if (videoPlayer) {
        return videoPlayer.currentTime || 0;
    }
    return 0;
}

function getMediaDuration() {
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.getDuration === 'function') {
        return ytPlayer.getDuration() || 0;
    } else if (videoPlayer) {
        return videoPlayer.duration || 0;
    }
    return 0;
}

function updateMediaUIPlayState(isPlaying) {
    if (mediaPlayPauseBtn) mediaPlayPauseBtn.textContent = isPlaying ? '⏸' : '▶';
    const disc = document.getElementById('music-disc-elem');
    if (disc) {
        if (isPlaying) disc.classList.remove('paused');
        else disc.classList.add('paused');
    }
}

function playMediaLocal() {
    updateMediaUIPlayState(true);
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
    } else if (videoPlayer) {
        videoPlayer.play().catch(() => {});
    }
}

function pauseMediaLocal() {
    updateMediaUIPlayState(false);
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
    } else if (videoPlayer) {
        videoPlayer.pause();
    }
}

function seekMediaLocal(targetTime) {
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.seekTo === 'function') {
        ytPlayer.seekTo(targetTime, true);
    } else if (videoPlayer) {
        videoPlayer.currentTime = targetTime;
    }
}

if (mediaPlayPauseBtn) {
    mediaPlayPauseBtn.addEventListener('click', () => {
        const isPlayingNow = mediaPlayPauseBtn.textContent === '⏸';
        const curTime = getMediaCurrentTime();
        if (isPlayingNow) {
            pauseMediaLocal();
            socket.emit('pause_video', { room: currentRoom, time: curTime });
        } else {
            playMediaLocal();
            socket.emit('play_video', { room: currentRoom, time: curTime });
        }
    });
}

if (mediaSeekBar) {
    mediaSeekBar.addEventListener('mousedown', () => { isUserSeeking = true; });
    mediaSeekBar.addEventListener('touchstart', () => { isUserSeeking = true; });

    const handleSeekChange = () => {
        isUserSeeking = false;
        const dur = getMediaDuration();
        if (dur > 0) {
            const targetTime = (parseFloat(mediaSeekBar.value) / 100) * dur;
            seekMediaLocal(targetTime);
            socket.emit('seek_video', { room: currentRoom, time: targetTime });
        }
    };

    mediaSeekBar.addEventListener('change', handleSeekChange);
    mediaSeekBar.addEventListener('input', (e) => {
        const dur = getMediaDuration();
        if (dur > 0) {
            const cur = (parseFloat(e.target.value) / 100) * dur;
            const currM = Math.floor(cur / 60).toString().padStart(2, '0');
            const currS = Math.floor(cur % 60).toString().padStart(2, '0');
            if (mediaTimeCurrent) mediaTimeCurrent.textContent = `${currM}:${currS}`;
        }
    });
}

if (mediaVolumeBar) {
    mediaVolumeBar.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        mediaVolume = val / 100;
        if (isYoutubeMode && ytPlayer && typeof ytPlayer.setVolume === 'function') {
            ytPlayer.setVolume(val);
        }
        if (videoPlayer) videoPlayer.volume = mediaVolume;
        if (mediaMuteBtn) mediaMuteBtn.textContent = val === 0 ? '🔇' : '🔊';
    });
}

if (mediaMuteBtn) {
    mediaMuteBtn.addEventListener('click', () => {
        isMediaMuted = !isMediaMuted;
        if (isYoutubeMode && ytPlayer) {
            if (isMediaMuted && typeof ytPlayer.mute === 'function') ytPlayer.mute();
            else if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
        }
        if (videoPlayer) videoPlayer.muted = isMediaMuted;
        mediaMuteBtn.textContent = isMediaMuted ? '🔇' : (mediaVolume === 0 ? '🔇' : '🔊');
    });
}

// İlerleme Çubuğu Güncelleme Zamanlayıcısı
setInterval(() => {
    const cur = getMediaCurrentTime();
    const dur = getMediaDuration();

    const currM = Math.floor(cur / 60).toString().padStart(2, '0');
    const currS = Math.floor(cur % 60).toString().padStart(2, '0');
    const durM = Math.floor(dur / 60).toString().padStart(2, '0');
    const durS = Math.floor(dur % 60).toString().padStart(2, '0');

    const timeStr = `${currM}:${currS}`;
    const durStr = `${durM}:${durS}`;

    if (mediaTimeCurrent && !isUserSeeking) mediaTimeCurrent.textContent = timeStr;
    if (mediaTimeTotal) mediaTimeTotal.textContent = durStr;

    const mCur = document.getElementById('music-time-current');
    const mTot = document.getElementById('music-time-total');
    const mProg = document.getElementById('music-progress-bar');
    if (mCur) mCur.textContent = timeStr;
    if (mTot) mTot.textContent = durStr;
    if (mProg && dur > 0) mProg.style.width = ((cur / dur) * 100) + '%';

    if (mediaSeekBar && !isUserSeeking && dur > 0) {
        mediaSeekBar.value = (cur / dur) * 100;
    }
}, 400);

// Socket.io Medya Senkronizasyon Olayları
socket.on('load_video', (data) => handleVideoLoading(data.videoUrl, data.requested_by));

socket.on('play_video', (data) => {
    isSyncing = true;
    if (Math.abs(getMediaCurrentTime() - data.time) > 1.5) seekMediaLocal(data.time);
    playMediaLocal();
    setTimeout(() => { isSyncing = false; }, 600);
});

socket.on('pause_video', (data) => {
    isSyncing = true;
    pauseMediaLocal();
    if (Math.abs(getMediaCurrentTime() - data.time) > 1.5) seekMediaLocal(data.time);
    setTimeout(() => { isSyncing = false; }, 600);
});

socket.on('seek_video', (data) => {
    isSyncing = true;
    seekMediaLocal(data.time);
    setTimeout(() => { isSyncing = false; }, 600);
});

socket.on('sync_media_state', (data) => {
    if (data.videoUrl) {
        handleVideoLoading(data.videoUrl, data.requested_by);
        isSyncing = true;
        seekMediaLocal(data.time || 0);
        if (data.isPlaying) playMediaLocal(); else pauseMediaLocal();
        setTimeout(() => { isSyncing = false; }, 800);
    }
});

// HTML5 Video Listenerları
videoPlayer.addEventListener('play', () => {
    updateMediaUIPlayState(true);
    if (!isSyncing && !isYoutubeMode) socket.emit('play_video', { room: currentRoom, time: videoPlayer.currentTime });
});
videoPlayer.addEventListener('pause', () => {
    updateMediaUIPlayState(false);
    if (!isSyncing && !isYoutubeMode) socket.emit('pause_video', { room: currentRoom, time: videoPlayer.currentTime });
});
videoPlayer.addEventListener('seeked', () => {
    if (!isSyncing && !isYoutubeMode) socket.emit('seek_video', { room: currentRoom, time: videoPlayer.currentTime });
});

// =========================================================================
// STRICT CLEANUP (Odadan Çıkınca Sesi Kesme & Tam Temizlik)
// =========================================================================

function leaveCurrentRoom() {
    // 1. YouTube Oyuncusunu Hafızadan Sil ve Durdur
    if (ytPlayer) {
        try {
            if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
            if (typeof ytPlayer.destroy === 'function') ytPlayer.destroy();
        } catch(e) {}
        ytPlayer = null;
    }

    // 2. DOM'daki tüm YouTube iframelerini ve Audio taglarını temizle
    if (youtubeContainer) {
        youtubeContainer.innerHTML = '<div id="yt-player"></div>';
        youtubeContainer.style.display = 'none';
    }
    const musicYtContainer = document.getElementById('music-youtube-container');
    if (musicYtContainer) {
        musicYtContainer.innerHTML = '<div id="music-yt-player"></div>';
    }
    document.querySelectorAll('iframe[src*="youtube"]').forEach(el => el.remove());
    document.querySelectorAll('audio[id^="audio-"]').forEach(el => {
        try { el.pause(); el.src = ''; el.load(); } catch(e) {}
        el.remove();
    });

    if (videoPlayer) {
        try {
            videoPlayer.pause();
            videoPlayer.src = '';
            videoPlayer.removeAttribute('src');
            videoPlayer.load();
        } catch(e) {}
    }

    // 3. WebRTC Ses & Ekran Track'lerini Kapat
    if (localAudioStream) {
        localAudioStream.getTracks().forEach(t => t.stop());
        localAudioStream = null;
    }
    if (localScreenStream) {
        localScreenStream.getTracks().forEach(t => t.stop());
        localScreenStream = null;
    }

    Object.keys(peers).forEach(sid => {
        if (peers[sid]) {
            try { peers[sid].close(); } catch(e) {}
            delete peers[sid];
        }
    });

    // 4. Socket'e Odadan Ayrılma Bildir
    if (currentRoom) {
        socket.emit('leave_room_event', {});
        socket.emit('leave-room', { room: currentRoom });
        currentRoom = '';
    }

    updateVoiceConnectionCard(null);
    switchMainView('friends');
    friendsDashboard.classList.remove('hidden');
    dmChatContainer.classList.add('hidden');
}

if (leaveRoomBtn) leaveRoomBtn.addEventListener('click', leaveCurrentRoom);
if (disconnectVoiceBtn) disconnectVoiceBtn.addEventListener('click', leaveCurrentRoom);

window.addEventListener('beforeunload', () => {
    leaveCurrentRoom();
    endDmCall();
});

window.addEventListener('pagehide', () => {
    leaveCurrentRoom();
    endDmCall();
});

// =========================================================================
// WEBRTC SES, ELECTRON UYUMU VE GÜRÜLTÜ ENGELLEME AYARLARI
// =========================================================================

function isElectronApp() {
    return !!(window.electronAPI && (window.electronAPI.isElectron || window.electronAPI.isElectronApp)) || /electron/i.test(navigator.userAgent);
}

async function getAudioStreamWithPermission(constraints) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia bu cihazda/tarayıcıda desteklenmiyor.');
    }

    if (window.electronAPI) {
        try {
            if (typeof window.electronAPI.requestMicrophonePermission === 'function') {
                await window.electronAPI.requestMicrophonePermission();
            } else if (typeof window.electronAPI.requestPermission === 'function') {
                await window.electronAPI.requestPermission('microphone');
            } else if (typeof window.electronAPI.askMicrophone === 'function') {
                await window.electronAPI.askMicrophone();
            }
        } catch (e) {
            console.warn('Electron mikrofon izin isteği uyarısı:', e);
        }
    }

    try {
        return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
        if (constraints && constraints.audio && typeof constraints.audio === 'object' && constraints.audio.deviceId) {
            console.warn('Seçili mikrofon ile açılamadı, varsayılan mikrofon cihazı deneniyor...');
            const fallbackConstraints = JSON.parse(JSON.stringify(constraints));
            delete fallbackConstraints.audio.deviceId;
            return await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        }
        throw err;
    }
}

function getAudioSettingsConstraints() {
    let ns = true, ec = true, agc = true;
    const saved = localStorage.getItem('ordex_audio_settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            ns = parsed.noiseSuppression !== false;
            ec = parsed.echoCancellation !== false;
            agc = parsed.autoGainControl !== false;
        } catch(e) {}
    }

    if (settingNoiseSuppression) settingNoiseSuppression.checked = ns;
    if (settingEchoCancellation) settingEchoCancellation.checked = ec;
    if (settingAutoGain) settingAutoGain.checked = agc;

    const audioConstraints = { noiseSuppression: ns, echoCancellation: ec, autoGainControl: agc };
    if (settingMicDevice && settingMicDevice.value) {
        audioConstraints.deviceId = { exact: settingMicDevice.value };
    }
    return audioConstraints;
}

function saveAndApplyAudioSettings() {
    const ns = settingNoiseSuppression ? settingNoiseSuppression.checked : true;
    const ec = settingEchoCancellation ? settingEchoCancellation.checked : true;
    const agc = settingAutoGain ? settingAutoGain.checked : true;

    const settings = { noiseSuppression: ns, echoCancellation: ec, autoGainControl: agc };
    localStorage.setItem('ordex_audio_settings', JSON.stringify(settings));

    applyAudioConstraintsToActiveStreams();
}

async function applyAudioConstraintsToActiveStreams() {
    const audioOpts = getAudioSettingsConstraints();
    const applyToStream = async (stream) => {
        if (stream && stream.getAudioTracks && stream.getAudioTracks().length > 0) {
            const track = stream.getAudioTracks()[0];
            if (track && typeof track.applyConstraints === 'function') {
                try {
                    await track.applyConstraints({
                        noiseSuppression: audioOpts.noiseSuppression,
                        echoCancellation: audioOpts.echoCancellation,
                        autoGainControl: audioOpts.autoGainControl
                    });
                } catch (err) {
                    console.warn('applyConstraints uyarısı:', err);
                }
            }
        }
    };
    await applyToStream(localAudioStream);
    await applyToStream(localDmStream);
}

[settingNoiseSuppression, settingEchoCancellation, settingAutoGain].forEach(el => {
    if (el) el.addEventListener('change', saveAndApplyAudioSettings);
});

// =========================================================================
// DISCORD DURUM SİSTEMİ (ONLINE / IDLE / DND / INVISIBLE)
// =========================================================================

function updateMyStatusUI(status) {
    myStatus = status;
    localStorage.setItem('ordex_user_status', status);
    if (myStatusIndicator) {
        myStatusIndicator.className = `user-status-dot ${status}`;
    }
}

if (myStatusIndicator) {
    myStatusIndicator.className = `user-status-dot ${myStatus}`;
}

if (myProfileTrigger) {
    myProfileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (statusSwitcherMenu) statusSwitcherMenu.classList.toggle('hidden');
    });
}

document.querySelectorAll('.status-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const status = opt.dataset.status;
        if (status) {
            updateMyStatusUI(status);
            socket.emit('change_status', { username: myUsername, status, custom_status: myCustomStatus });
            if (statusSwitcherMenu) statusSwitcherMenu.classList.add('hidden');
        }
    });
});

document.addEventListener('click', (e) => {
    if (statusSwitcherMenu && !statusSwitcherMenu.classList.contains('hidden') && !e.target.closest('#status-switcher-menu')) {
        statusSwitcherMenu.classList.add('hidden');
    }
});

socket.on('user_status_change', (data) => {
    if (data.username === myUsername && data.status) {
        updateMyStatusUI(data.status);
    }
    if (data.username === currentPmTarget && pmTargetStatusDot) {
        const effStatus = data.isOnline ? (data.status || 'online') : 'offline';
        pmTargetStatusDot.className = `status-text ${effStatus}`;
        const statusMap = { online: '• Çevrimiçi', idle: '• Boşta', dnd: '• Rahatsız Etmeyin', invisible: '• Çevrimdışı', offline: '• Çevrimdışı' };
        pmTargetStatusDot.textContent = statusMap[effStatus] || '• Çevrimdışı';
    }
    loadFriendsList();
});

// =========================================================================
// DM WEBRTC ARAMA SİSTEMİ (Sesli & Görüntülü Arama)
// =========================================================================

if (startVoiceCallBtn) startVoiceCallBtn.addEventListener('click', () => startDmCall('voice'));
if (startVideoCallBtn) startVideoCallBtn.addEventListener('click', () => startDmCall('video'));

async function startDmCall(type) {
    if (!currentPmTarget) return;
    dmCallTarget = currentPmTarget;
    dmCallType = type;
    isInCall = true;

    embeddedCallName.textContent = `${currentPmTarget} Aranıyor... (${type === 'video' ? 'Görüntülü' : 'Sesli'})`;
    callRemoteAvatar.className = 'user-avatar large';
    callRemoteAvatar.innerHTML = renderAvatar('🎮');
    callLocalAvatar.className = `user-avatar medium ${myAvatarFrame}`;
    callLocalAvatar.innerHTML = renderAvatar(myAvatar, myAvatarFrame);

    embeddedDmCall.classList.remove('hidden');
    activeCallStrip.classList.add('hidden');

    try {
        localDmStream = await getAudioStreamWithPermission({
            audio: getAudioSettingsConstraints(),
            video: type === 'video'
        });
        if (type === 'video') {
            localDmVideo.style.display = 'block';
            localDmVideo.srcObject = localDmStream;
        }
    } catch (err) {
        alert('Kamera veya mikrofona erişilemedi!');
        endDmCall();
        return;
    }

    socket.emit('dm_call_request', {
        sender: myUsername,
        senderDisplayName: myDisplayName,
        senderAvatar: myAvatar,
        senderFrame: myAvatarFrame,
        receiver: dmCallTarget,
        callType: type
    });
}

socket.on('dm_call_error', (data) => {
    alert(data.message || 'Kullanıcıya ulaşılamıyor.');
    endDmCall();
});

socket.on('dm_call_request', (data) => {
    incomingCallData = data;
    incomingCallerName.textContent = data.senderDisplayName || data.sender;
    incomingCallAvatar.className = `user-avatar large ${data.senderFrame || 'none'}`;
    incomingCallAvatar.innerHTML = renderAvatar(data.senderAvatar, data.senderFrame);
    incomingCallTypeText.textContent = `${data.callType === 'video' ? 'Görüntülü' : 'Sesli'} arama başlatmak istiyor...`;
    incomingCallModal.classList.remove('hidden');
    playNotifSound('call');
});

if (acceptCallBtn) acceptCallBtn.addEventListener('click', async () => {
    if (!incomingCallData) return;
    incomingCallModal.classList.add('hidden');
    dmCallTarget = incomingCallData.sender;
    dmCallType = incomingCallData.callType;
    isInCall = true;

    embeddedCallName.textContent = `${incomingCallData.senderDisplayName || dmCallTarget} ile Bağlandı`;
    callRemoteAvatar.className = `user-avatar large ${incomingCallData.senderFrame || 'none'}`;
    callRemoteAvatar.innerHTML = renderAvatar(incomingCallData.senderAvatar, incomingCallData.senderFrame);
    callLocalAvatar.className = `user-avatar medium ${myAvatarFrame}`;
    callLocalAvatar.innerHTML = renderAvatar(myAvatar, myAvatarFrame);

    embeddedDmCall.classList.remove('hidden');
    activeCallStrip.classList.add('hidden');

    try {
        localDmStream = await getAudioStreamWithPermission({
            audio: getAudioSettingsConstraints(),
            video: dmCallType === 'video'
        });
        if (dmCallType === 'video') {
            localDmVideo.style.display = 'block';
            localDmVideo.srcObject = localDmStream;
        }
    } catch (err) { console.error(err); }

    socket.emit('dm_call_response', {
        sender: myUsername,
        receiver: dmCallTarget,
        accepted: true
    });

    initiateDmPeerConnection(dmCallTarget, true);
});

if (rejectCallBtn) rejectCallBtn.addEventListener('click', () => {
    if (incomingCallData) {
        socket.emit('dm_call_response', {
            sender: myUsername,
            receiver: incomingCallData.sender,
            accepted: false
        });
    }
    incomingCallModal.classList.add('hidden');
    incomingCallData = null;
});

socket.on('dm_call_response', async (data) => {
    if (data.accepted) {
        embeddedCallName.textContent = `${dmCallTarget} ile Bağlandı`;
        initiateDmPeerConnection(data.sender, false);
    } else {
        alert('Arama reddedildi.');
        endDmCall();
    }
});

function initiateDmPeerConnection(targetUser, isReceiver) {
    dmPeerConnection = new RTCPeerConnection(rtcConfig);

    if (localDmStream) {
        localDmStream.getTracks().forEach(track => dmPeerConnection.addTrack(track, localDmStream));
    }

    dmPeerConnection.ontrack = (event) => {
        if (event.track.kind === 'video') {
            remoteDmVideo.style.display = 'block';
            remoteDmVideo.srcObject = event.streams[0];
        } else if (event.track.kind === 'audio') {
            remoteDmAudio.srcObject = event.streams[0];
            remoteDmAudio.play().catch(() => {});
        }
    };

    dmPeerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('dm_webrtc_ice_candidate', {
                target: targetUser,
                sender: myUsername,
                candidate: event.candidate
            });
        }
    };

    if (!isReceiver) {
        dmPeerConnection.createOffer().then(offer => {
            dmPeerConnection.setLocalDescription(offer);
            socket.emit('dm_webrtc_offer', {
                target: targetUser,
                sender: myUsername,
                offer: offer
            });
        });
    }
}

socket.on('dm_webrtc_offer', async (data) => {
    if (!dmPeerConnection) initiateDmPeerConnection(data.sender, true);
    await dmPeerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await dmPeerConnection.createAnswer();
    await dmPeerConnection.setLocalDescription(answer);
    socket.emit('dm_webrtc_answer', {
        target: data.sender,
        sender: myUsername,
        answer: answer
    });
});

socket.on('dm_webrtc_answer', async (data) => {
    if (dmPeerConnection) {
        await dmPeerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        embeddedCallName.textContent = `${dmCallTarget} ile Bağlandı`;
    }
});

socket.on('dm_webrtc_ice_candidate', async (data) => {
    if (dmPeerConnection && data.candidate) {
        try {
            await dmPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch(e) {}
    }
});

if (embedEndCallBtn) embedEndCallBtn.addEventListener('click', () => {
    socket.emit('dm_call_end', { target: dmCallTarget, sender: myUsername });
    endDmCall();
});

if (callStripEndBtn) callStripEndBtn.addEventListener('click', () => {
    socket.emit('dm_call_end', { target: dmCallTarget, sender: myUsername });
    endDmCall();
});

if (callStripReturnBtn) callStripReturnBtn.addEventListener('click', () => {
    activeCallStrip.classList.add('hidden');
    switchMainView('friends');
    friendsDashboard.classList.add('hidden');
    dmChatContainer.classList.remove('hidden');
});

socket.on('dm_call_end', () => endDmCall());

function endDmCall() {
    if (localDmStream) {
        localDmStream.getTracks().forEach(track => track.stop());
        localDmStream = null;
    }
    if (dmPeerConnection) {
        try { dmPeerConnection.close(); } catch(e) {}
        dmPeerConnection = null;
    }
    embeddedDmCall.classList.add('hidden');
    activeCallStrip.classList.add('hidden');
    isInCall = false;
    dmCallTarget = null;
}

if (embedToggleMicBtn) embedToggleMicBtn.addEventListener('click', () => {
    if (localDmStream) {
        const audioTrack = localDmStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            embedToggleMicBtn.textContent = audioTrack.enabled ? '🎙️' : '🔇';
            callStripMicBtn.textContent = audioTrack.enabled ? '🎙️' : '🔇';
        }
    }
});

// =========================================================================
// KULLANICI GİRİŞİ, HESAP DEĞİŞTİRME & SOCKET BAĞLANTISI
// =========================================================================

function saveSavedAccount(accountData) {
    let saved = JSON.parse(localStorage.getItem('ordex_saved_accounts') || '[]');
    saved = saved.filter(a => a.username !== accountData.username);
    saved.push(accountData);
    localStorage.setItem('ordex_saved_accounts', JSON.stringify(saved));
}

function renderSavedAccountsMenu() {
    savedAccountsList.innerHTML = '';
    const saved = JSON.parse(localStorage.getItem('ordex_saved_accounts') || '[]');
    if (saved.length === 0) {
        savedAccountsList.innerHTML = '<div style="color:#666; font-size:0.75rem; text-align:center;">Kayıtlı başka hesap yok.</div>';
        return;
    }

    saved.forEach(acc => {
        const item = document.createElement('div');
        item.className = 'switcher-account-item';
        item.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar small">${renderAvatar(acc.avatar)}</div>
                <span>${acc.display_name} (@${acc.username})</span>
            </div>
            ${acc.username === myUsername ? '<span style="color:var(--neon-green);">✓</span>' : ''}
        `;
        item.addEventListener('click', () => {
            accountSwitcherMenu.classList.add('hidden');
            enterApp(acc);
        });
        savedAccountsList.appendChild(item);
    });
}

if (openAccountSwitchBtn) openAccountSwitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderSavedAccountsMenu();
    accountSwitcherMenu.classList.toggle('hidden');
});

if (addNewAccountBtn) addNewAccountBtn.addEventListener('click', () => {
    accountSwitcherMenu.classList.add('hidden');
    appLayout.classList.add('hidden');
    authView.classList.remove('hidden');
    authUsernameInput.value = '';
    authPasswordInput.value = '';
});

function switchTab(mode) {
    authMode = mode;
    tabLogin.classList.remove('active');
    tabRegister.classList.remove('active');
    tabGuest.classList.remove('active');
    document.getElementById(`tab-${mode}`).classList.add('active');
    
    passwordGroup.style.display = (mode === 'guest') ? 'none' : 'block';
    authActionBtn.textContent = mode === 'login' ? 'Giriş Yap' : (mode === 'register' ? 'Kayıt Ol' : 'Misafir Girişi');
    authMessage.textContent = '';
}

tabLogin.addEventListener('click', () => switchTab('login'));
tabRegister.addEventListener('click', () => switchTab('register'));
tabGuest.addEventListener('click', () => switchTab('guest'));

if (authUsernameInput) {
    authUsernameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (authMode === 'guest') authActionBtn.click();
            else if (authPasswordInput) authPasswordInput.focus();
        }
    });
}
if (authPasswordInput) {
    authPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') authActionBtn.click();
    });
}

authActionBtn.addEventListener('click', async () => {
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!username) { authMessage.textContent = 'Kullanıcı adı gerekli!'; return; }

    if (authMode === 'guest') {
        const guestData = {
            username,
            display_name: username,
            password: '',
            avatar: '🎮',
            about: 'Siberpunk platform sakini.',
            avatar_frame: 'none',
            profile_banner: 'linear-gradient(135deg, #00f0ff, #8a2be2)',
            badges: '🎮',
            is_admin: 0
        };
        saveSavedAccount(guestData);
        enterApp(guestData);
    } else {
        if (!password) { authMessage.textContent = 'Şifre gerekli!'; return; }
        const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (data.success) {
                authMessage.style.color = '#00f0ff';
                authMessage.textContent = data.message || (authMode === 'register' ? 'Kayıt başarılı! Giriş yapılıyor...' : 'Giriş başarılı!');
                if (data.user) {
                    data.user.password = password;
                    saveSavedAccount(data.user);
                    setTimeout(() => enterApp(data.user), 300);
                } else if (authMode === 'register') {
                    switchTab('login');
                }
            } else {
                authMessage.style.color = '#ff3366';
                authMessage.textContent = data.message || 'Hata oluştu!';
            }
        } catch (e) {
            authMessage.style.color = '#ff3366';
            authMessage.textContent = 'Sunucuya bağlanılamadı.';
        }
    }
});

function enterApp(userData) {
    myUsername = userData.username;
    myDisplayName = userData.display_name || userData.username;
    myAvatar = userData.avatar || '🎮';
    myAbout = userData.about || 'Siberpunk platform sakini.';
    myAvatarFrame = userData.avatar_frame || 'none';
    myProfileBanner = userData.profile_banner || 'linear-gradient(135deg, #00f0ff, #8a2be2)';
    myCustomStatus = userData.custom_status || '';
    myBadges = userData.badges || '🎮';
    myIsAdmin = userData.is_admin || 0;

    authView.classList.add('hidden');
    appLayout.classList.remove('hidden');

    if (myIsAdmin === 1) {
        tabProfAdmin.classList.remove('hidden');
    } else {
        tabProfAdmin.classList.add('hidden');
    }

    updateProfileUI();
    loadAudioDevices();

    socket.emit('register_user', {
        username: myUsername,
        display_name: myDisplayName,
        avatar: myAvatar,
        avatar_frame: myAvatarFrame,
        profile_banner: myProfileBanner,
        badges: myBadges,
        is_admin: myIsAdmin,
        status: myStatus,
        custom_status: myCustomStatus
    });
    socket.emit('get_rooms');
    loadFriendsList();
    loadGroupsList();
}

function updateProfileUI() {
    myAvatarDisplay.className = `user-avatar ${myAvatarFrame}`;
    myAvatarDisplay.innerHTML = renderAvatar(myAvatar, myAvatarFrame);
    myDisplayNameEl.textContent = myDisplayName;
    myUsernameTagEl.textContent = '@' + myUsername;
    if (myStatusIndicator) myStatusIndicator.className = `user-status-dot ${myStatus}`;
}

socket.on('connect', () => {
    if (myUsername) {
        socket.emit('register_user', {
            username: myUsername,
            display_name: myDisplayName,
            avatar: myAvatar,
            avatar_frame: myAvatarFrame,
            profile_banner: myProfileBanner,
            badges: myBadges,
            is_admin: myIsAdmin,
            status: myStatus,
            custom_status: myCustomStatus
        });
        if (currentRoom) {
            socket.emit('join_room', { 
                 username: myUsername, 
                 room: currentRoom, 
                 room_type: currentRoomType,
                 create_new: false,
                 avatar: myAvatar 
            });
            if (localAudioStream && localAudioStream.getAudioTracks().length > 0) {
                socket.emit('mute_status', { muted: !localAudioStream.getAudioTracks()[0].enabled });
            }
        }
    }
});

// =========================================================================
// ODA YÖNETİMİ, SESLİ KANAL & WEBRTC
// =========================================================================

function switchMainView(view) {
    const dmSidebarContent = document.getElementById('dm-sidebar-content');
    const roomSidebarContent = document.getElementById('room-sidebar-content');

    if (view === 'friends') {
        friendsView.classList.remove('hidden');
        roomView.classList.add('hidden');
        homeDmBtn.classList.add('active-server');
        if (dmSidebarContent) dmSidebarContent.classList.remove('hidden');
        if (roomSidebarContent) roomSidebarContent.classList.add('hidden');
        document.querySelectorAll('.server-icon.room-icon').forEach(el => el.classList.remove('active-server'));
        if (isInCall && dmChatContainer.classList.contains('hidden')) {
            activeCallStrip.classList.remove('hidden');
        }
    } else if (view === 'room') {
        friendsView.classList.add('hidden');
        roomView.classList.remove('hidden');
        homeDmBtn.classList.remove('active-server');
        if (dmSidebarContent) dmSidebarContent.classList.add('hidden');
        if (roomSidebarContent) roomSidebarContent.classList.remove('hidden');
        if (isInCall) {
            activeCallStrip.classList.remove('hidden');
        }
    }
}

homeDmBtn.addEventListener('click', () => switchMainView('friends'));

if (createRoomModalBtn) createRoomModalBtn.addEventListener('click', () => createRoomModal.classList.remove('hidden'));
if (closeCreateRoomBtn) closeCreateRoomBtn.addEventListener('click', () => createRoomModal.classList.add('hidden'));

if (createRoomBtn) {
    createRoomBtn.addEventListener('click', () => {
        const name = newRoomNameInput.value.trim();
        const type = newRoomTypeSelect.value;
        if (name) {
            createRoomModal.classList.add('hidden');
            newRoomNameInput.value = '';
            joinRoom(name, type, true);
        }
    });
}

function updateVoiceConnectionCard(roomName) {
    if (voiceConnectionCard) {
        if (roomName) {
            voiceConnectionCard.classList.remove('hidden');
            if (voiceConnChannelName) voiceConnChannelName.textContent = roomName;
        } else {
            voiceConnectionCard.classList.add('hidden');
        }
    }
}

async function joinRoom(roomName, roomType = 'watch', createNew = false) {
    if (currentRoom) leaveCurrentRoom();
    
    currentRoom = roomName;
    currentRoomType = roomType;
    isHost = createNew;
    
    setupRoomUI(roomType);
    switchMainView('room');
    updateVoiceConnectionCard(roomName);
    
    currentRoomDisplay.textContent = roomName;
    roleBadge.textContent = isHost ? 'Yönetici' : 'İzleyici';
    chatMessages.innerHTML = '';
    
    try {
        await requestMicrophonePermission();
    } catch(e) {
        console.warn('Mikrofon izni hazırlığı uyarısı:', e);
    }

    socket.emit('join_room', {
        username: myUsername,
        room: roomName,
        room_type: roomType,
        create_new: createNew,
        avatar: myAvatar
    });
}

function setupRoomUI(type) {
    currentRoomType = type;
    const discordRoomName = document.getElementById('discord-room-name');
    if (discordRoomName) discordRoomName.textContent = currentRoom;

    if (type === 'screen') {
        watchPartyUI.classList.add('hidden');
        if (musicPartyUI) musicPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.remove('hidden');
        shareScreenBtn.classList.remove('hidden');
    } else if (type === 'music') {
        watchPartyUI.classList.add('hidden');
        if (musicPartyUI) musicPartyUI.classList.remove('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    } else {
        watchPartyUI.classList.remove('hidden');
        if (musicPartyUI) musicPartyUI.classList.add('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    }
}

socket.on('room_info', (data) => {
    isHost = data.is_host;
    roleBadge.textContent = isHost ? 'Yönetici' : 'İzleyici';
    if (nextVideoBtn) nextVideoBtn.classList.toggle('hidden', !isHost);
});

socket.on('room_list', (rooms) => {
    sidebarRoomsList.innerHTML = '';
    for (let r in rooms) {
        const info = rooms[r];
        const btn = document.createElement('button');
        btn.className = `server-icon room-icon ${currentRoom === r ? 'active-server' : ''}`;
        btn.title = `${r} (${info.count} kişi)`;
        
        let emoji = '🎬';
        if (info.type === 'music') emoji = '🎵';
        else if (info.type === 'screen') emoji = '🖥️';
        
        btn.innerHTML = `<span>${emoji}</span><span class="server-badge">${info.count}</span>`;
        btn.addEventListener('click', () => {
            if (currentRoom === r) {
                switchMainView('room');
            } else {
                pendingJoinRoom = { name: r, type: info.type };
                joinRoomModalText.textContent = `'${r}' odasına katılmak istiyor musunuz?`;
                joinRoomModal.classList.remove('hidden');
            }
        });
        sidebarRoomsList.appendChild(btn);
    }
});

if (confirmJoinRoomBtn) {
    confirmJoinRoomBtn.addEventListener('click', () => {
        if (pendingJoinRoom) {
            joinRoom(pendingJoinRoom.name, pendingJoinRoom.type, false);
            pendingJoinRoom = null;
        }
        joinRoomModal.classList.add('hidden');
    });
}
if (cancelJoinRoomBtn) cancelJoinRoomBtn.addEventListener('click', () => { joinRoomModal.classList.add('hidden'); });

loadVideoBtn.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (url) {
        socket.emit('request_video', { videoUrl: url });
        videoUrlInput.value = '';
    }
});

if (nextVideoBtn) {
    nextVideoBtn.addEventListener('click', () => {
        socket.emit('next_video');
    });
}

socket.on('update_queue', (data) => {
    queueListContainer.innerHTML = '';
    if (!data.queue || data.queue.length === 0) {
        queueListContainer.innerHTML = '<div style="color: #666; font-size: 0.8rem; text-align: center; padding: 10px;">Sırada video yok.</div>';
        return;
    }
    data.queue.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item';
        div.innerHTML = `
            <div style="font-size: 0.85rem; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 170px;">
                ${index + 1}. ${item.url}
            </div>
            <div style="font-size: 0.7rem; color: var(--neon-cyan);">
                İsteyen: ${item.requested_by}
            </div>
        `;
        queueListContainer.appendChild(div);
    });
});

async function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
        if (!localAudioStream) {
            localAudioStream = await getAudioStreamWithPermission({ audio: getAudioSettingsConstraints(), video: false });
        }
        
        const isCurrentlyMuted = micToggleBtn ? micToggleBtn.textContent.includes('Aç') : false;
        localAudioStream.getAudioTracks().forEach(t => t.enabled = !isCurrentlyMuted);
        socket.emit('mute_status', { muted: isCurrentlyMuted });

        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }

        monitorAudio(localAudioStream, socket.id);

        for (const targetSid in peers) {
            const pc = peers[targetSid];
            if (pc) {
                let trackAdded = false;
                localAudioStream.getTracks().forEach(track => {
                    const senders = pc.getSenders();
                    if (!senders.some(s => s.track && s.track.kind === track.kind)) {
                        pc.addTrack(track, localAudioStream);
                        trackAdded = true;
                    }
                });

                if (trackAdded && pc.signalingState === 'stable') {
                    pc.createOffer()
                        .then(offer => pc.setLocalDescription(offer))
                        .then(() => {
                            socket.emit('webrtc_offer', {
                                target_sid: targetSid,
                                sender_sid: socket.id,
                                offer: pc.localDescription
                            });
                        })
                        .catch(err => console.error('WebRTC renegotiation offer hatası:', err));
                }
            }
        }
    } catch (e) {
        console.error('Mikrofon erişim hatası:', e);
        showToast('Sesli konuşma için mikrofon erişimi reddedildi veya cihaz bulunamadı.', 'error');
    }
}

if (micToggleBtn) {
    micToggleBtn.addEventListener('click', async () => {
        if (!localAudioStream) { await requestMicrophonePermission(); if (!localAudioStream) return; }
        const track = localAudioStream.getAudioTracks()[0];
        track.enabled = !track.enabled;
        const isMuted = !track.enabled;
        socket.emit('mute_status', { muted: isMuted });
        micToggleBtn.textContent = isMuted ? '🎙️ Sesi Aç' : '🔇 Sesi Kapat';
        if (profileMicBtn) profileMicBtn.innerHTML = isMuted ? '🔇' : '🎙️';
        renderVoiceUser(socket.id, myDisplayName, isMuted, myAvatar);
    });
}

function monitorAudio(stream, sid) {
    if (!audioContext) return;
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkAudio() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        let avg = sum / bufferLength;
        const userDiv = document.getElementById('voice-user-' + sid);
        if (userDiv) {
            if (avg > 15) {
                userDiv.classList.add('speaking');
                if (sid === socket.id && myProfileTrigger) myProfileTrigger.classList.add('speaking');
            } else {
                userDiv.classList.remove('speaking');
                if (sid === socket.id && myProfileTrigger) myProfileTrigger.classList.remove('speaking');
            }
        }
        requestAnimationFrame(checkAudio);
    }
    checkAudio();
}

function renderVoiceUser(sid, username, isMuted, avatar = '🎮') {
    let div = document.getElementById('voice-user-' + sid);
    if (!div) {
        div = document.createElement('div');
        div.id = 'voice-user-' + sid;
        div.className = 'voice-user';
        voiceUsersList.appendChild(div);
    }
    const isMe = sid === socket.id;
    const kickBtn = (isHost && !isMe) ? `<button class="kick-btn" onclick="kickRoomUser('${sid}')">🚫</button>` : '';
    const avatarHtml = renderAvatar(avatar);

    div.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <div class="voice-avatar-wrap">
                ${avatarHtml}
            </div>
            <span class="voice-user-name" style="${isMe ? 'color: var(--neon-purple);' : ''}">${isMe ? username + ' (Sen)' : username}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
            <span class="mute-indicator">${isMuted ? '🔇' : '🎙️'}</span>
            ${kickBtn}
        </div>
    `;
}

window.kickRoomUser = function(targetSid) {
    if (isHost && confirm('Bu kullanıcıyı odadan atmak istiyor musunuz?')) {
        socket.emit('kick_room_user', { target_sid: targetSid });
    }
};

socket.on('kicked_from_room', () => {
    alert('Oda sahibi tarafından odadan atıldınız!');
    leaveCurrentRoom();
});

let selectedAudioOutputDeviceId = '';

function playRemoteAudioTrack(stream, targetSid) {
    let audioEl = document.getElementById('audio-' + targetSid);
    if (!audioEl) {
        audioEl = document.createElement('audio');
        audioEl.id = 'audio-' + targetSid;
        audioEl.autoplay = true;
        audioEl.playsInline = true;
        document.body.appendChild(audioEl);
    }
    audioEl.srcObject = stream;
    audioEl.muted = isDeafenedGlobal;
    if (settingOutputVolume) {
        audioEl.volume = (settingOutputVolume.value || 100) / 100;
    }
    if (selectedAudioOutputDeviceId && typeof audioEl.setSinkId === 'function') {
        audioEl.setSinkId(selectedAudioOutputDeviceId).catch(() => {});
    }
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.warn("Autoplay engellendi, kullanıcı etkileşimi bekleniyor:", err);
            pendingAudioElements.add(audioEl);
        });
    }
}

async function flushPendingCandidates(targetSid) {
    const pc = peers[targetSid];
    if (!pc || !pc.remoteDescription) return;
    if (pendingCandidates[targetSid] && pendingCandidates[targetSid].length > 0) {
        const candidates = [...pendingCandidates[targetSid]];
        pendingCandidates[targetSid] = [];
        for (const candidate of candidates) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('Pending ICE candidate ekleme hatası:', err);
            }
        }
    }
}

function createPeerConnection(targetSid, isInitiator = false) {
    if (peers[targetSid] && peers[targetSid].signalingState !== 'closed') {
        try { peers[targetSid].close(); } catch(e) {}
        delete peers[targetSid];
    }

    const pc = new RTCPeerConnection(rtcConfig);
    peers[targetSid] = pc;
    pendingCandidates[targetSid] = [];

    if (localAudioStream) {
        localAudioStream.getTracks().forEach(track => {
            pc.addTrack(track, localAudioStream);
        });
    }
    if (localScreenStream) {
        localScreenStream.getTracks().forEach(track => {
            pc.addTrack(track, localScreenStream);
        });
    }

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('webrtc_ice_candidate', {
                target_sid: targetSid,
                sender_sid: socket.id,
                candidate: event.candidate
            });
        }
    };

    pc.ontrack = (event) => {
        if (event.track.kind === 'video') {
            const vStream = (event.streams && event.streams[0]) ? event.streams[0] : new MediaStream([event.track]);
            renderScreenShare(targetSid, 'Yayın', vStream);
        } else if (event.track.kind === 'audio') {
            const aStream = (event.streams && event.streams[0]) ? event.streams[0] : new MediaStream([event.track]);
            playRemoteAudioTrack(aStream, targetSid);
            monitorAudio(aStream, targetSid);
        }
    };

    if (isInitiator) {
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
                socket.emit('webrtc_offer', {
                    target_sid: targetSid,
                    sender_sid: socket.id,
                    offer: pc.localDescription
                });
            })
            .catch(err => console.error('WebRTC Offer oluşturma hatası:', err));
    }

    return pc;
}

socket.on('room_users_list', (users) => {
    voiceUsersList.innerHTML = '';
    users.forEach(u => {
        renderVoiceUser(u.sid, u.username, u.muted, u.avatar);
        if (u.sid !== socket.id) {
            const isInitiator = socket.id > u.sid;
            if (isInitiator) {
                createPeerConnection(u.sid, true);
            } else {
                if (!peers[u.sid] || peers[u.sid].signalingState === 'closed') {
                    createPeerConnection(u.sid, false);
                }
            }
        }
    });
});

socket.on('user_joined', (data) => {
    renderVoiceUser(data.sid, data.username, data.muted, data.avatar);
    if (data.sid !== socket.id) {
        const isInitiator = socket.id > data.sid;
        if (isInitiator) {
            createPeerConnection(data.sid, true);
        } else {
            if (!peers[data.sid] || peers[data.sid].signalingState === 'closed') {
                createPeerConnection(data.sid, false);
            }
        }
    }
});

socket.on('user_left', (data) => {
    if (peers[data.sid]) {
        try { peers[data.sid].close(); } catch(e) {}
        delete peers[data.sid];
    }
    delete pendingCandidates[data.sid];

    const audioEl = document.getElementById('audio-' + data.sid);
    if (audioEl) {
        try { audioEl.pause(); audioEl.src = ''; } catch(e) {}
        audioEl.remove();
        pendingAudioElements.delete(audioEl);
    }

    const div = document.getElementById('voice-user-' + data.sid);
    if (div) div.remove();
    removeScreenShare(data.sid);
});

socket.on('user_mute_status', (data) => {
    const div = document.getElementById('voice-user-' + data.sid);
    if (div) {
        const icon = div.querySelector('.mute-indicator');
        if (icon) icon.textContent = data.muted ? '🔇' : '🎙️';
    }
});

socket.on('webrtc_offer', async (data) => {
    try {
        let pc = peers[data.sender_sid];
        if (!pc || pc.signalingState === 'closed') {
            pc = createPeerConnection(data.sender_sid, false);
        }
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        await flushPendingCandidates(data.sender_sid);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc_answer', {
            target_sid: data.sender_sid,
            sender_sid: socket.id,
            answer: answer
        });
    } catch (err) {
        console.error('webrtc_offer alma hatası:', err);
    }
});

socket.on('webrtc_answer', async (data) => {
    try {
        const pc = peers[data.sender_sid];
        if (pc && pc.signalingState !== 'closed') {
            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            await flushPendingCandidates(data.sender_sid);
        }
    } catch (err) {
        console.error('webrtc_answer alma hatası:', err);
    }
});

socket.on('webrtc_ice_candidate', async (data) => {
    try {
        const pc = peers[data.sender_sid];
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else {
            if (!pendingCandidates[data.sender_sid]) {
                pendingCandidates[data.sender_sid] = [];
            }
            pendingCandidates[data.sender_sid].push(data.candidate);
        }
    } catch (err) {
        console.error('ICE candidate alma hatası:', err);
    }
});

// Ekran Paylaşımı
if (shareScreenBtn) {
    shareScreenBtn.addEventListener('click', async () => {
        if (!isScreenSharing) {
            try {
                if (isElectronApp()) {
                    if (window.electronAPI && typeof window.electronAPI.getDisplayMedia === 'function') {
                        localScreenStream = await window.electronAPI.getDisplayMedia();
                    } else if (window.electronAPI && typeof window.electronAPI.getDesktopSources === 'function') {
                        const sources = await window.electronAPI.getDesktopSources({ types: ['screen', 'window'] });
                        if (sources && sources.length > 0) {
                            localScreenStream = await navigator.mediaDevices.getUserMedia({
                                audio: false,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: sources[0].id
                                    }
                                }
                            });
                        } else {
                            localScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                        }
                    } else {
                        localScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                    }
                } else {
                    localScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                }

                if (localScreenStream) {
                    isScreenSharing = true;
                    shareScreenBtn.textContent = '⏹ Yayını Durdur';
                    shareScreenBtn.classList.add('cancel');
                    renderScreenShare(socket.id, `${myDisplayName} (Sen)`, localScreenStream);
                    
                    Object.values(peers).forEach(pc => {
                        localScreenStream.getTracks().forEach(track => pc.addTrack(track, localScreenStream));
                    });
                    
                    if (localScreenStream.getVideoTracks()[0]) {
                        localScreenStream.getVideoTracks()[0].onended = () => {
                            stopScreenShare();
                        };
                    }
                }
            } catch (err) {
                console.error('Ekran paylaşımı hatası:', err);
                showToast('Ekran paylaşımı başlatılamadı.', 'error');
            }
        } else {
            stopScreenShare();
        }
    });
}

function stopScreenShare() {
    if (localScreenStream) {
        localScreenStream.getTracks().forEach(track => track.stop());
        localScreenStream = null;
    }
    isScreenSharing = false;
    shareScreenBtn.textContent = '🖥️ Ekranı Paylaş';
    shareScreenBtn.classList.remove('cancel');
    removeScreenShare(socket.id);
}

function renderScreenShare(sid, title, stream) {
    if (noScreenMsg) noScreenMsg.classList.add('hidden');
    let container = document.getElementById('screen-container-' + sid);
    if (!container) {
        container = document.createElement('div');
        container.id = 'screen-container-' + sid;
        container.className = 'screen-item-box';
        container.innerHTML = `
            <div class="screen-item-header">${title}</div>
            <video autoplay playsinline ${sid === socket.id ? 'muted' : ''}></video>
        `;
        container.addEventListener('click', () => {
            container.classList.toggle('maximized');
        });
        screenShareUI.appendChild(container);
    }
    const video = container.querySelector('video');
    video.srcObject = stream;
}

function removeScreenShare(sid) {
    const container = document.getElementById('screen-container-' + sid);
    if (container) container.remove();
    if (screenShareUI.querySelectorAll('.screen-item-box').length === 0) {
        if (noScreenMsg) noScreenMsg.classList.remove('hidden');
    }
}

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
        let elem = (currentRoomType === 'watch') ? watchPartyUI : ((currentRoomType === 'screen') ? screenShareUI : musicPartyUI);
        if (elem) {
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        }
    });
}

// =========================================================================
// ARKADAŞLIK, DİREKT MESAJ (DM) VE GRUP YÖNETİMİ
// =========================================================================

// --- CYBERPUNK TOAST BİLDİRİM SİSTEMİ ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span style="cursor:pointer; font-weight:bold; margin-left:8px;" onclick="this.parentElement.remove()">✕</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        if (toast && toast.parentElement) toast.remove();
    }, 4000);
}

const tabFriendsPending = document.getElementById('tab-friends-pending');
const pendingBadge = document.getElementById('pending-badge');
const userSearchInput = document.getElementById('user-search-input');
const userSearchResults = document.getElementById('user-search-results');

if (tabFriendsAll) tabFriendsAll.addEventListener('click', () => setFriendsFilter('all'));
if (tabFriendsOnline) tabFriendsOnline.addEventListener('click', () => setFriendsFilter('online'));
if (tabFriendsPending) tabFriendsPending.addEventListener('click', () => setFriendsFilter('pending'));
if (tabGroupsList) tabGroupsList.addEventListener('click', () => setFriendsFilter('groups'));
if (tabFriendsAdd) tabFriendsAdd.addEventListener('click', () => setFriendsFilter('add'));

function setFriendsFilter(filter) {
    friendsFilter = filter;
    if (tabFriendsAll) tabFriendsAll.classList.remove('active');
    if (tabFriendsOnline) tabFriendsOnline.classList.remove('active');
    if (tabFriendsPending) tabFriendsPending.classList.remove('active');
    if (tabGroupsList) tabGroupsList.classList.remove('active');
    if (tabFriendsAdd) tabFriendsAdd.classList.remove('active');
    
    if (filter === 'all' && tabFriendsAll) tabFriendsAll.classList.add('active');
    else if (filter === 'online' && tabFriendsOnline) tabFriendsOnline.classList.add('active');
    else if (filter === 'pending' && tabFriendsPending) tabFriendsPending.classList.add('active');
    else if (filter === 'groups' && tabGroupsList) tabGroupsList.classList.add('active');
    else if (filter === 'add' && tabFriendsAdd) tabFriendsAdd.classList.add('active');

    addFriendContainer.classList.toggle('hidden', filter !== 'add');
    groupActionsBar.classList.toggle('hidden', filter !== 'groups');

    if (filter === 'groups') renderGroupsList(activeGroupsList);
    else if (filter === 'pending') renderPendingRequestsList();
    else renderFriendsList(activeFriendsList);
}

// --- KULLANICI ARAMA SİSTEMİ (DEBOUNCED SEARCH) ---
let searchDebounceTimer = null;
if (userSearchInput && userSearchResults) {
    userSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        const query = e.target.value.trim();
        if (!query) {
            userSearchResults.classList.add('hidden');
            userSearchResults.innerHTML = '';
            return;
        }
        searchDebounceTimer = setTimeout(() => {
            searchUsers(query);
        }, 300);
    });

    userSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(searchDebounceTimer);
            const query = userSearchInput.value.trim();
            if (query) searchUsers(query);
        }
    });

    document.addEventListener('click', (e) => {
        if (userSearchInput && userSearchResults && !userSearchInput.contains(e.target) && !userSearchResults.contains(e.target)) {
            userSearchResults.classList.add('hidden');
        }
    });
}

window.startPrivateChatFromSearch = function(username, displayName, avatar, avatarFrame, about, isOnline) {
    if (userSearchResults) userSearchResults.classList.add('hidden');
    if (userSearchInput) userSearchInput.value = '';
    openPrivateChat({
        username,
        displayName: displayName || username,
        avatar: avatar || '🎮',
        avatarFrame: avatarFrame || 'none',
        about: about || '',
        isOnline: !!isOnline
    });
};

async function searchUsers(query) {
    if (!myUsername || !userSearchResults) return;
    try {
        userSearchResults.classList.remove('hidden');
        userSearchResults.innerHTML = '<div style="padding:10px; font-size:0.8rem; color:var(--neon-cyan); text-align:center;">🔍 Aratılıyor...</div>';

        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&username=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        userSearchResults.innerHTML = '';
        if (data.success && data.results && data.results.length > 0) {
            data.results.forEach(u => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                let btnHtml = '';
                if (u.isFriend) {
                    btnHtml = '<span style="font-size:0.75rem; color:var(--neon-green);">Arkadaş</span>';
                } else if (u.hasPendingReq) {
                    btnHtml = '<span style="font-size:0.75rem; color:var(--neon-cyan);">İstek Bekliyor</span>';
                } else {
                    btnHtml = `<button class="cyber-btn small" onclick="event.stopPropagation(); window.sendFriendRequest('${u.username}')">+ Ekle</button>`;
                }

                const safeDisplayName = (u.displayName || u.username).replace(/'/g, "\\'");
                const safeAbout = (u.about || '').replace(/'/g, "\\'");

                div.innerHTML = `
                    <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="event.stopPropagation(); window.openUserProfileModal('${u.username}')" title="Profili Görüntüle">
                        <div class="user-avatar small ${u.avatarFrame || 'none'}">${renderAvatar(u.avatar, u.avatarFrame)}</div>
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-size:0.85rem; font-weight:bold;">${u.displayName}</span>
                            <span style="font-size:0.7rem; color:var(--text-muted);">@${u.username}</span>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button class="cyber-btn small" title="Sohbet Başlat" onclick="event.stopPropagation(); window.startPrivateChatFromSearch('${u.username}', '${safeDisplayName}', '${u.avatar}', '${u.avatarFrame || 'none'}', '${safeAbout}', ${u.isOnline})">💬 DM</button>
                        ${btnHtml}
                    </div>
                `;

                div.addEventListener('click', () => {
                    userSearchResults.classList.add('hidden');
                    if (userSearchInput) userSearchInput.value = '';
                    openPrivateChat({
                        username: u.username,
                        displayName: u.displayName,
                        avatar: u.avatar,
                        avatarFrame: u.avatarFrame,
                        about: u.about,
                        isOnline: u.isOnline
                    });
                });

                userSearchResults.appendChild(div);
            });
        } else {
            userSearchResults.innerHTML = '<div style="padding:10px; font-size:0.8rem; color:#888; text-align:center;">Kullanıcı bulunamadı.</div>';
        }
    } catch(e) { 
        console.error('Kullanıcı arama hatası:', e); 
        if (userSearchResults) {
            userSearchResults.innerHTML = '<div style="padding:10px; font-size:0.8rem; color:#ff3366; text-align:center;">Arama sırasında hata oluştu.</div>';
        }
    }
}

// --- ARKADAŞLIK İSTEĞİ FONKSİYONLARI ---
async function sendFriendRequest(friendName) {
    if (!friendName) return;
    try {
        const res = await fetch('/api/friends/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: myUsername, friendName })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            if (addFriendInput) addFriendInput.value = '';
            loadFriendsList();
            loadFriendRequests();
        }
    } catch (e) { console.error(e); }
}
window.sendFriendRequest = sendFriendRequest;

if (addFriendBtn) {
    addFriendBtn.addEventListener('click', () => {
        const friendName = addFriendInput.value.trim();
        if (friendName) sendFriendRequest(friendName);
    });
}

async function acceptFriendRequest(requestId, friendName) {
    try {
        const res = await fetch('/api/friends/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: myUsername, requestId, friendName })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            loadFriendsList();
            loadFriendRequests();
        }
    } catch(e) { console.error(e); }
}
window.acceptFriendRequest = acceptFriendRequest;

async function rejectFriendRequest(requestId, friendName) {
    try {
        const res = await fetch('/api/friends/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: myUsername, requestId, friendName })
        });
        const data = await res.json();
        showToast(data.message, 'info');
        loadFriendRequests();
    } catch(e) { console.error(e); }
}
window.rejectFriendRequest = rejectFriendRequest;

async function removeFriend(friendName) {
    if (!confirm(`'${friendName}' kullanıcısını arkadaşlarınızdan çıkarmak istiyor musunuz?`)) return;
    try {
        const res = await fetch('/api/friends/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: myUsername, friendName })
        });
        const data = await res.json();
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) {
            loadFriendsList();
        }
    } catch(e) { console.error(e); }
}
window.removeFriend = removeFriend;

let pendingRequestsData = { received: [], sent: [] };

async function loadFriendRequests() {
    if (!myUsername) return;
    try {
        const res = await fetch(`/api/friends/requests?username=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        if (data.success) {
            pendingRequestsData = { received: data.received || [], sent: data.sent || [] };
            if (pendingBadge) {
                const count = pendingRequestsData.received.length;
                pendingBadge.textContent = count;
                pendingBadge.classList.toggle('hidden', count === 0);
            }
            if (friendsFilter === 'pending') {
                renderPendingRequestsList();
            }
        }
    } catch(e) { console.error(e); }
}

function renderPendingRequestsList() {
    friendsListContainer.innerHTML = '';
    friendsCardsGrid.innerHTML = '';

    const total = pendingRequestsData.received.length + pendingRequestsData.sent.length;
    friendsCountBadge.textContent = `${total} Bekleyen İstek`;

    if (total === 0) {
        friendsListContainer.innerHTML = '<div style="color:#666; font-size:0.8rem; text-align:center; padding:10px;">Bekleyen arkadaşlık isteği yok.</div>';
        return;
    }

    if (pendingRequestsData.received.length > 0) {
        const title = document.createElement('div');
        title.className = 'channel-category-header';
        title.innerHTML = '<span>GELEN İSTEKLER</span>';
        friendsCardsGrid.appendChild(title);

        pendingRequestsData.received.forEach(r => {
            const card = document.createElement('div');
            card.className = 'pending-request-card';
            card.innerHTML = `
                <div class="friend-info">
                    <div class="user-avatar ${r.avatarFrame || 'none'}">${renderAvatar(r.avatar, r.avatarFrame)}</div>
                    <div class="friend-names">
                        <span class="friend-name">${r.displayName}</span>
                        <span class="friend-tag">@${r.username}</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="cyber-btn small" onclick="window.acceptFriendRequest('${r.id}', '${r.username}')">✓ Kabul Et</button>
                    <button class="cyber-btn small cancel" onclick="window.rejectFriendRequest('${r.id}', '${r.username}')">✕ Reddet</button>
                </div>
            `;
            friendsCardsGrid.appendChild(card);
        });
    }

    if (pendingRequestsData.sent.length > 0) {
        const title = document.createElement('div');
        title.className = 'channel-category-header';
        title.style.marginTop = '16px';
        title.innerHTML = '<span>GÖNDERİLEN İSTEKLER</span>';
        friendsCardsGrid.appendChild(title);

        pendingRequestsData.sent.forEach(r => {
            const card = document.createElement('div');
            card.className = 'pending-request-card';
            card.innerHTML = `
                <div class="friend-info">
                    <div class="user-avatar ${r.avatarFrame || 'none'}">${renderAvatar(r.avatar, r.avatarFrame)}</div>
                    <div class="friend-names">
                        <span class="friend-name">${r.displayName}</span>
                        <span class="friend-tag">@${r.username} (İstek Bekliyor)</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="cyber-btn small cancel" onclick="window.rejectFriendRequest('${r.id}', '${r.username}')">İptal Et</button>
                </div>
            `;
            friendsCardsGrid.appendChild(card);
        });
    }
}

async function loadFriendsList() {
    if (!myUsername) return;
    try {
        const res = await fetch(`/api/friends/list?username=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        if (data.success) {
            activeFriendsList = data.friends;
            if (friendsFilter !== 'groups' && friendsFilter !== 'pending') renderFriendsList(activeFriendsList);
        }
        loadFriendRequests();
    } catch (e) { console.error(e); }
}

function renderFriendsList(friends) {
    friendsListContainer.innerHTML = '';
    friendsCardsGrid.innerHTML = '';

    let filtered = friends;
    if (friendsFilter === 'online') filtered = friends.filter(f => f.isOnline);

    friendsCountBadge.textContent = `${filtered.length} Arkadaş`;

    if (filtered.length === 0) {
        friendsListContainer.innerHTML = '<div style="color:#666; font-size:0.8rem; text-align:center; padding:10px;">Arkadaş bulunamadı.</div>';
    }

    filtered.forEach(f => {
        const effStatus = f.isOnline ? (f.userStatus || 'online') : 'offline';
        const item = document.createElement('div');
        item.className = `friend-item ${currentPmTarget === f.username ? 'active' : ''}`;
        const unreadCount = unreadMessages[f.username] || 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';

        item.innerHTML = `
            <div class="friend-info">
                <div class="user-avatar small ${f.avatarFrame || 'none'}">${renderAvatar(f.avatar, f.avatarFrame)}</div>
                <div class="friend-names">
                    <span class="friend-name">${f.displayName} ${f.isAdmin ? '👑' : ''}</span>
                    <span class="friend-tag">@${f.username}${f.customStatus ? ' - ' + f.customStatus : ''}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <span class="status-dot ${effStatus}"></span>
                ${badgeHtml}
            </div>
        `;
        item.addEventListener('click', () => openPrivateChat(f));
        friendsListContainer.appendChild(item);

        const card = document.createElement('div');
        card.className = 'friend-card';
        card.innerHTML = `
            <div class="friend-info">
                <div class="user-avatar ${f.avatarFrame || 'none'}">${renderAvatar(f.avatar, f.avatarFrame)}</div>
                <div class="friend-names">
                    <span class="friend-name">${f.displayName} ${f.isAdmin ? '👑' : ''}</span>
                    <span class="friend-tag">@${f.username}${f.customStatus ? ' - ' + f.customStatus : ''}</span>
                </div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="cyber-btn small">Mesaj Gönder</button>
                <button class="cyber-btn small cancel" onclick="event.stopPropagation(); window.removeFriend('${f.username}')" title="Arkadaşlıktan Çıkar">🚫</button>
            </div>
        `;
        card.querySelector('button').addEventListener('click', () => openPrivateChat(f));
        friendsCardsGrid.appendChild(card);
    });
}

async function openPrivateChat(friendObj) {
    currentChatType = 'dm';
    currentPmTarget = friendObj.username;
    currentGroupObj = null;

    unreadMessages[friendObj.username] = 0;
    renderFriendsList(activeFriendsList);

    switchMainView('friends');
    friendsDashboard.classList.add('hidden');
    dmChatContainer.classList.remove('hidden');

    dmHeaderAvatar.className = `user-avatar small ${friendObj.avatarFrame || 'none'}`;
    dmHeaderAvatar.innerHTML = renderAvatar(friendObj.avatar, friendObj.avatarFrame);
    pmTargetDisplayname.textContent = friendObj.displayName;
    pmTargetUsernameTag.textContent = '@' + friendObj.username;
    
    const effStatus = friendObj.isOnline ? (friendObj.userStatus || 'online') : 'offline';
    const statusMap = { online: '• Çevrimiçi', idle: '• Boşta', dnd: '• Rahatsız Etmeyin', invisible: '• Çevrimdışı', offline: '• Çevrimdışı' };
    pmTargetStatusDot.textContent = statusMap[effStatus] || '• Çevrimdışı';
    pmTargetStatusDot.className = `status-text ${effStatus}`;

    const badgePills = (friendObj.badges || '🎮').split(',').map(b => `<span class="profile-badge-pill">${b}</span>`).join('');
    const bannerBg = (friendObj.profileBanner && friendObj.profileBanner.startsWith('http')) 
        ? `url(${friendObj.profileBanner})` 
        : (friendObj.profileBanner || 'linear-gradient(135deg, #00f0ff, #8a2be2)');

    rightSidebarMembersList.innerHTML = `
        <div class="member-item" style="flex-direction:column; align-items:center; text-align:center; padding:12px; gap:8px;">
            <div class="profile-card-banner" style="background: ${bannerBg};"></div>
            <div class="user-avatar medium ${friendObj.avatarFrame || 'none'}" style="margin-top:-30px;">${renderAvatar(friendObj.avatar, friendObj.avatarFrame)}</div>
            <div>
                <div class="friend-name" style="font-size:1rem; font-weight:bold;">${friendObj.displayName} ${friendObj.isAdmin ? '👑' : ''}</div>
                <div class="friend-tag">@${friendObj.username}</div>
            </div>
            <div class="profile-badges-row">${badgePills}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">${friendObj.about || ''}</div>
        </div>
    `;

    loadPrivateChatHistory(friendObj.username);
}

async function loadPrivateChatHistory(otherUser) {
    pmMessagesContainer.innerHTML = '<div style="color:#666; font-size:0.8rem; text-align:center;">Mesajlar yükleniyor...</div>';
    try {
        const res = await fetch(`/api/pm/history?user1=${encodeURIComponent(myUsername)}&user2=${encodeURIComponent(otherUser)}&requester=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        pmMessagesContainer.innerHTML = '';
        if (data.success && data.history) {
            data.history.forEach(msg => {
                appendPmMessage(msg.sender, msg.message, msg.time, msg.read);
            });
            socket.emit('mark_read', { sender: otherUser, receiver: myUsername });
        } else if (data.message) {
            showToast(data.message, 'error');
        }
    } catch (e) { console.error(e); }
}

let activeReplyTarget = null;
const replyPreviewBar = document.getElementById('reply-preview-bar');
const replyTargetName = document.getElementById('reply-target-name');
const replyTargetText = document.getElementById('reply-target-text');
const cancelReplyBtn = document.getElementById('cancel-reply-btn');
const typingIndicator = document.getElementById('typing-indicator');
const typingText = document.getElementById('typing-text');

if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener('click', () => {
        activeReplyTarget = null;
        if (replyPreviewBar) replyPreviewBar.classList.add('hidden');
    });
}

function setReplyTarget(msgId, sender, text) {
    activeReplyTarget = { id: msgId, sender, text };
    if (replyTargetName) replyTargetName.textContent = sender;
    if (replyTargetText) replyTargetText.textContent = text;
    if (replyPreviewBar) replyPreviewBar.classList.remove('hidden');
    if (pmInput) pmInput.focus();
}
window.setReplyTarget = setReplyTarget;

let typingEmitTimeout = null;
if (pmInput) {
    pmInput.addEventListener('input', () => {
        if (!currentPmTarget) return;
        socket.emit('typing_start', { sender: myUsername, receiver: currentPmTarget });
        clearTimeout(typingEmitTimeout);
        typingEmitTimeout = setTimeout(() => {
            socket.emit('typing_stop', { sender: myUsername, receiver: currentPmTarget });
        }, 2000);
    });

    pmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrivateMessage();
        }
    });
}

function appendPmMessage(sender, message, time = new Date().toLocaleTimeString(), read = false, replyTo = null, edited = false, customId = null) {
    const isMe = sender === myUsername;
    const msgDiv = document.createElement('div');
    const msgId = customId || ('pm_' + Date.now() + Math.random().toString(36).substr(2, 4));
    msgDiv.className = `dm-message ${isMe ? 'my-pm' : 'other-pm'}`;
    msgDiv.id = msgId;

    let contentHtml = message;
    if (message.startsWith('data:image') || (message.startsWith('http') && (message.endsWith('.png') || message.endsWith('.jpg') || message.endsWith('.gif') || message.includes('tenor.com') || message.includes('giphy.com')))) {
        contentHtml = `<img src="${message}" class="chat-img-attachment" referrerPolicy="no-referrer" crossOrigin="anonymous">`;
    }

    const replyHtml = replyTo ? `
        <div class="reply-preview-snippet" style="font-size:0.75rem; color:var(--text-muted); border-left:2px solid var(--neon-cyan); padding-left:6px; margin-bottom:4px; cursor:pointer;" onclick="document.getElementById('${replyTo.id}')?.scrollIntoView({behavior:'smooth'})">
            ↪ <strong>@${replyTo.sender}</strong>: ${replyTo.text.length > 30 ? replyTo.text.substr(0, 30) + '...' : replyTo.text}
        </div>
    ` : '';

    const editedHtml = edited ? `<span class="edited-tag">(düzenlendi)</span>` : '';
    const readReceiptHtml = isMe ? `<div class="read-receipt">${read ? '✔️ Görüldü' : '✔️ İletildi'}</div>` : '';

    const actionButtons = `
        <div class="message-hover-actions">
            <button class="msg-action-btn" onclick="window.setReplyTarget('${msgId}', '${sender}', '${message.replace(/'/g, "\\'")}')" title="Yanıtla">💬</button>
            ${isMe ? `<button class="msg-action-btn" onclick="window.editPrivateMessage('${msgId}', '${message.replace(/'/g, "\\'")}')" title="Düzenle">✏️</button>` : ''}
            ${isMe ? `<button class="msg-action-btn" onclick="window.deletePrivateMessage('${msgId}')" title="Sil">🗑️</button>` : ''}
            <button class="msg-action-btn" onclick="navigator.clipboard.writeText('${message.replace(/'/g, "\\'")}'); showToast('Mesaj kopyalandı!', 'success')" title="Kopyala">📋</button>
        </div>
    `;

    msgDiv.innerHTML = `
        ${actionButtons}
        ${replyHtml}
        <div class="dm-sender" style="cursor:pointer;" onclick="window.openUserProfileModal('${sender}')">${sender} <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">${time}</span></div>
        <div class="dm-text" id="text-${msgId}">${contentHtml} ${editedHtml}</div>
        ${readReceiptHtml}
        <div class="msg-reactions" id="reactions-${msgId}" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
        <div class="msg-reaction-btn" onclick="showEmojiPicker('${msgId}', '${currentPmTarget}')" title="Tepki Ekle">😀</div>
    `;

    pmMessagesContainer.appendChild(msgDiv);
    pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
}

function sendPrivateMessage() {
    const msg = pmInput.value.trim();
    if (!msg || !currentPmTarget) return;

    socket.emit('send_private_message', {
        sender: myUsername,
        receiver: currentPmTarget,
        message: msg,
        replyTo: activeReplyTarget
    });

    if (activeReplyTarget) {
        activeReplyTarget = null;
        if (replyPreviewBar) replyPreviewBar.classList.add('hidden');
    }

    pmInput.value = '';
    loadFriendsList();
}

function editPrivateMessage(msgId, oldText) {
    const newText = prompt('Mesajı düzenle:', oldText);
    if (newText !== null && newText.trim() !== '' && newText.trim() !== oldText) {
        socket.emit('edit_private_message', {
            msgId,
            sender: myUsername,
            newMessage: newText.trim()
        });
    }
}
window.editPrivateMessage = editPrivateMessage;

function deletePrivateMessage(msgId) {
    if (confirm('Bu mesajı silmek istediğinize emin misiniz?')) {
        socket.emit('delete_private_message', {
            msgId,
            sender: myUsername
        });
    }
}
window.deletePrivateMessage = deletePrivateMessage;

function sendImageOrGif(url) {
    if (currentPmTarget) {
        socket.emit('send_private_message', {
            sender: myUsername,
            receiver: currentPmTarget,
            message: url,
            replyTo: activeReplyTarget
        });
        if (activeReplyTarget) {
            activeReplyTarget = null;
            if (replyPreviewBar) replyPreviewBar.classList.add('hidden');
        }
        loadFriendsList();
    }
}

// Dosya Gönderme / Drag & Drop
if (attachFileBtn) attachFileBtn.addEventListener('click', () => chatFileInput.click());
if (chatFileInput) {
    chatFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && currentPmTarget) {
            const reader = new FileReader();
            reader.onload = function(evt) { sendImageOrGif(evt.target.result); };
            reader.readAsDataURL(file);
        }
    });
}

if (chatDropZone) {
    chatDropZone.addEventListener('dragover', (e) => { e.preventDefault(); if (chatDragOverlay) chatDragOverlay.classList.remove('hidden'); });
    chatDropZone.addEventListener('dragleave', () => { if (chatDragOverlay) chatDragOverlay.classList.add('hidden'); });
    chatDropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (chatDragOverlay) chatDragOverlay.classList.add('hidden');
        if (e.dataTransfer.files && e.dataTransfer.files[0] && currentPmTarget) {
            const reader = new FileReader();
            reader.onload = function(evt) { sendImageOrGif(evt.target.result); };
            reader.readAsDataURL(e.dataTransfer.files[0]);
        }
    });
}

// Tenor GIF
if (closeGifModalBtn) closeGifModalBtn.addEventListener('click', () => gifPickerModal.classList.add('hidden'));

async function loadTrendingGifs(query = 'cyberpunk') {
    gifResultsGrid.innerHTML = '<div style="color:#888; text-align:center; grid-column:span 3;">GIF\'ler Yükleniyor...</div>';
    try {
        const res = await fetch(`/api/gifs?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        gifResultsGrid.innerHTML = '';
        if (data.success && data.gifs && data.gifs.length > 0) {
            data.gifs.forEach(gifUrl => {
                const img = document.createElement('img');
                img.className = 'gif-thumb-item';
                img.src = gifUrl;
                img.addEventListener('click', () => {
                    if (gifPickerContext === 'profile') {
                        if (profileAvatarUrlInput) profileAvatarUrlInput.value = gifUrl;
                    } else if (currentPmTarget) {
                        sendImageOrGif(gifUrl);
                    }
                    gifPickerModal.classList.add('hidden');
                });
                gifResultsGrid.appendChild(img);
            });
        } else {
            gifResultsGrid.innerHTML = '<div style="color:#888; text-align:center; grid-column:span 3;">GIF bulunamadı.</div>';
        }
    } catch (e) {
        gifResultsGrid.innerHTML = '<div style="color:#ff3366; text-align:center; grid-column:span 3;">GIF servisine erişilemedi.</div>';
    }
}

let gifPickerContext = 'chat';
if (openProfileGifBtn) {
    openProfileGifBtn.addEventListener('click', () => {
        gifPickerContext = 'profile';
        loadTrendingGifs();
        gifPickerModal.classList.remove('hidden');
    });
}
if (openGifBtn) {
    openGifBtn.addEventListener('click', () => {
        gifPickerContext = 'chat';
        loadTrendingGifs();
        gifPickerModal.classList.remove('hidden');
    });
}
if (gifSearchInput) {
    gifSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const q = gifSearchInput.value.trim();
            if (q) loadTrendingGifs(q);
        }
    });
}
if (gifSearchBtn) {
    gifSearchBtn.addEventListener('click', () => {
        const q = gifSearchInput.value.trim();
        if (q) loadTrendingGifs(q);
    });
}

// --- KULLANICI PROFİL POPOUT VE ENGELLEME MODALI ---
async function openUserProfileModal(username) {
    if (!username) return;
    try {
        const res = await fetch(`/api/profile/get?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.success && data.profile) {
            const u = data.profile;
            const popoutModal = document.getElementById('user-profile-modal');
            const popoutAvatar = document.getElementById('popout-avatar');
            const popoutDisplayName = document.getElementById('popout-displayname');
            const popoutUsername = document.getElementById('popout-username');
            const popoutStatus = document.getElementById('popout-status');
            const popoutBadges = document.getElementById('popout-badges');
            const popoutAbout = document.getElementById('popout-about');
            const popoutDmBtn = document.getElementById('popout-dm-btn');
            const popoutFriendBtn = document.getElementById('popout-friend-btn');
            const popoutBlockBtn = document.getElementById('popout-block-btn');

            if (popoutAvatar) {
                popoutAvatar.className = `user-avatar large ${u.avatar_frame || 'none'}`;
                popoutAvatar.innerHTML = renderAvatar(u.avatar, u.avatar_frame);
            }
            if (popoutDisplayName) popoutDisplayName.textContent = u.display_name || u.username;
            if (popoutUsername) popoutUsername.textContent = '@' + u.username;
            if (popoutAbout) popoutAbout.textContent = u.about || '';
            if (popoutBadges) {
                popoutBadges.innerHTML = (u.badges || '🎮').split(',').map(b => `<span class="profile-badge-pill">${b}</span>`).join('');
            }

            if (popoutDmBtn) {
                popoutDmBtn.onclick = () => {
                    if (popoutModal) popoutModal.classList.add('hidden');
                    openPrivateChat({
                        username: u.username,
                        displayName: u.display_name || u.username,
                        avatar: u.avatar,
                        avatarFrame: u.avatar_frame,
                        about: u.about,
                        isOnline: true
                    });
                };
            }

            if (popoutFriendBtn) {
                popoutFriendBtn.onclick = () => {
                    window.sendFriendRequest(u.username);
                };
            }

            if (popoutBlockBtn) {
                popoutBlockBtn.onclick = async () => {
                    if (confirm(`'${u.username}' kullanıcısını engellemek istiyor musunuz?`)) {
                        const bRes = await fetch('/api/users/block', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: myUsername, targetUser: u.username })
                        });
                        const bData = await bRes.json();
                        showToast(bData.message, bData.success ? 'success' : 'error');
                        if (popoutModal) popoutModal.classList.add('hidden');
                        loadFriendsList();
                    }
                };
            }

            if (popoutModal) popoutModal.classList.remove('hidden');
        }
    } catch(e) { console.error(e); }
}
window.openUserProfileModal = openUserProfileModal;

const closeUserProfileBtn = document.getElementById('close-user-profile-btn');
if (closeUserProfileBtn) {
    closeUserProfileBtn.addEventListener('click', () => {
        document.getElementById('user-profile-modal')?.classList.add('hidden');
    });
}

// --- KALICI BİLDİRİM MERKEZİ ---
let notificationsLog = [];
function addNotification(title, text) {
    notificationsLog.unshift({ id: Date.now(), title, text, time: new Date().toLocaleTimeString() });
    const badge = document.getElementById('notification-unread-badge');
    if (badge) {
        badge.textContent = notificationsLog.length;
        badge.classList.remove('hidden');
    }
    renderNotificationsList();
}

function renderNotificationsList() {
    const listContainer = document.getElementById('notification-list');
    if (!listContainer) return;
    if (notificationsLog.length === 0) {
        listContainer.innerHTML = '<div style="color:#666; font-size:0.8rem; text-align:center; padding:15px;">Henüz bildiriminiz yok.</div>';
        return;
    }
    listContainer.innerHTML = '';
    notificationsLog.forEach(n => {
        const div = document.createElement('div');
        div.className = 'notification-item';
        div.innerHTML = `
            <div style="font-weight:bold; font-size:0.85rem;">${n.title} <span style="font-size:0.7rem; color:#888; font-weight:normal; float:right;">${n.time}</span></div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${n.text}</div>
        `;
        listContainer.appendChild(div);
    });
}

const notifBellBtn = document.getElementById('notification-bell-btn');
const notifDrawer = document.getElementById('notification-drawer');
const closeNotifBtn = document.getElementById('close-notifications-btn');

if (notifBellBtn && notifDrawer) {
    notifBellBtn.addEventListener('click', () => {
        notifDrawer.classList.toggle('hidden');
        const badge = document.getElementById('notification-unread-badge');
        if (badge) badge.classList.add('hidden');
    });
}
if (closeNotifBtn && notifDrawer) {
    closeNotifBtn.addEventListener('click', () => notifDrawer.classList.add('hidden'));
}

socket.on('receive_private_message', (data) => {
    const otherUser = data.sender === myUsername ? data.receiver : data.sender;
    if (data.sender !== myUsername) {
        playNotifSound('message');
        addNotification(`💬 @${data.sender} kullanıcısından mesaj`, data.message.length > 40 ? data.message.substring(0, 40) + '...' : data.message);
    }
    
    if (currentPmTarget === otherUser && !dmChatContainer.classList.contains('hidden')) {
        appendPmMessage(data.sender, data.message, data.time || new Date().toLocaleTimeString(), data.read, data.replyTo, data.edited, data.id);
        if (data.sender !== myUsername) {
            socket.emit('mark_read', { sender: data.sender, receiver: myUsername });
        }
    } else {
        if (data.sender !== myUsername) {
            unreadMessages[otherUser] = (unreadMessages[otherUser] || 0) + 1;
            loadFriendsList();
        }
    }
});

socket.on('user_typing_start', (data) => {
    if (data.sender === currentPmTarget && typingIndicator) {
        typingIndicator.classList.remove('hidden');
        if (typingText) typingText.textContent = `@${data.sender} yazıyor...`;
    }
});

socket.on('user_typing_stop', (data) => {
    if (data.sender === currentPmTarget && typingIndicator) {
        typingIndicator.classList.add('hidden');
    }
});

socket.on('private_message_edited', (data) => {
    const textElem = document.getElementById(`text-${data.msgId}`);
    if (textElem) {
        textElem.innerHTML = `${data.newMessage} <span class="edited-tag">(düzenlendi)</span>`;
    }
});

socket.on('private_message_deleted', (data) => {
    const msgElem = document.getElementById(data.msgId);
    if (msgElem) {
        msgElem.style.opacity = '0';
        setTimeout(() => msgElem.remove(), 300);
    }
});

socket.on('friends_updated', () => { 
    loadFriendsList(); 
    loadFriendRequests();
});

socket.on('friend_request_received', (data) => {
    showToast(`${data.displayName || data.sender} size arkadaşlık isteği gönderdi!`, 'info');
    loadFriendsList();
    loadFriendRequests();
});

socket.on('error_message', (data) => {
    showToast(data.message || 'Bir hata oluştu.', 'error');
});

// Grup Yönetimi
if (openCreateGroupBtn) {
    openCreateGroupBtn.addEventListener('click', () => {
        groupFriendsCheckboxList.innerHTML = '';
        activeFriendsList.forEach(f => {
            const item = document.createElement('label');
            item.className = 'checkbox-friend-item';
            item.innerHTML = `
                <input type="checkbox" value="${f.username}">
                <span>${f.displayName} (@${f.username})</span>
            `;
            groupFriendsCheckboxList.appendChild(item);
        });
        createGroupModal.classList.remove('hidden');
    });
}
if (closeCreateGroupBtn) closeCreateGroupBtn.addEventListener('click', () => createGroupModal.classList.add('hidden'));

if (submitCreateGroupBtn) {
    submitCreateGroupBtn.addEventListener('click', async () => {
        const groupName = newGroupNameInput.value.trim();
        if (!groupName) return;

        const selectedMembers = [];
        groupFriendsCheckboxList.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            selectedMembers.push(cb.value);
        });

        try {
            const res = await fetch('/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leader: myUsername,
                    name: groupName,
                    avatar: selectedGroupAvatar,
                    members: selectedMembers
                })
            });
            const data = await res.json();
            if (data.success) {
                createGroupModal.classList.add('hidden');
                newGroupNameInput.value = '';
                loadGroupsList();
            } else alert(data.message);
        } catch (e) { console.error(e); }
    });
}

async function loadGroupsList() {
    if (!myUsername) return;
    try {
        const res = await fetch(`/api/groups/list?username=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        if (data.success) {
            activeGroupsList = data.groups;
            if (friendsFilter === 'groups') renderGroupsList(activeGroupsList);
        }
    } catch (e) { console.error(e); }
}

function renderGroupsList(groups) {
    friendsListContainer.innerHTML = '';
    if (groups.length === 0) {
        friendsListContainer.innerHTML = '<div style="color:#666; font-size:0.8rem; text-align:center; padding:10px;">Henüz dahil olduğunuz grup yok.</div>';
        return;
    }
    groups.forEach(g => {
        const item = document.createElement('div');
        item.className = 'friend-item';
        item.innerHTML = `
            <div class="friend-info">
                <div class="user-avatar small">${g.avatar || '👥'}</div>
                <div class="friend-names">
                    <span class="friend-name">${g.name}</span>
                    <span class="friend-tag">${g.members.length} Üye (Lider: ${g.leader})</span>
                </div>
            </div>
        `;
        item.addEventListener('click', () => openGroupChat(g));
        friendsListContainer.appendChild(item);
    });
}

function openGroupChat(groupObj) {
    currentChatType = 'group';
    currentGroupObj = groupObj;
    currentPmTarget = null;

    switchMainView('friends');
    friendsDashboard.classList.add('hidden');
    dmChatContainer.classList.remove('hidden');

    dmHeaderAvatar.innerHTML = groupObj.avatar || '👥';
    pmTargetDisplayname.textContent = groupObj.name;
    pmTargetUsernameTag.textContent = `(Grup • ${groupObj.members.length} Üye)`;
    pmTargetStatusDot.textContent = `• Lider: ${groupObj.leader}`;
    pmTargetStatusDot.className = 'status-text online';

    rightSidebarMembersList.innerHTML = '';
    const isLeader = groupObj.leader === myUsername;

    groupObj.members.forEach(m => {
        const mDiv = document.createElement('div');
        mDiv.className = 'member-item';
        const kickBtn = (isLeader && m.username !== myUsername)
            ? `<button class="kick-btn" onclick="kickGroupMember(${groupObj.id}, '${m.username}')">🚫 At</button>`
            : '';
        mDiv.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <div class="user-avatar small ${m.avatarFrame || 'none'}">${renderAvatar(m.avatar, m.avatarFrame)}</div>
                <div>
                    <div class="friend-name">${m.displayName} ${m.isAdmin ? '👑' : ''}</div>
                    <div class="friend-tag">@${m.username}</div>
                </div>
            </div>
            ${kickBtn}
        `;
        rightSidebarMembersList.appendChild(mDiv);
    });
}

window.kickGroupMember = async function(groupId, targetUser) {
    if (confirm(`${targetUser} kullanıcısını gruptan atmak istiyor musunuz?`)) {
        try {
            const res = await fetch('/api/groups/kick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ group_id: groupId, leader: myUsername, target_user: targetUser })
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) loadGroupsList();
        } catch(e) { console.error(e); }
    }
};

socket.on('groups_updated', () => { loadGroupsList(); });

if (toggleRightSidebarBtn) {
    toggleRightSidebarBtn.addEventListener('click', () => {
        dmRightSidebar.classList.toggle('hidden');
    });
}

// =========================================================================
// PROFİL VE CANLI ÖN İZLEME MODALI
// =========================================================================

if (myProfileNameTrigger) myProfileNameTrigger.addEventListener('click', openMyOwnProfileInSidebar);

function openMyOwnProfileInSidebar() {
    switchMainView('friends');
    friendsDashboard.classList.add('hidden');
    dmChatContainer.classList.remove('hidden');
    dmRightSidebar.classList.remove('hidden');

    const badgePills = (myBadges || '🎮').split(',').map(b => `<span class="profile-badge-pill">${b}</span>`).join('');
    rightSidebarMembersList.innerHTML = `
        <div class="member-item" style="flex-direction:column; align-items:center; text-align:center; padding:12px; gap:8px;">
            <div class="profile-card-banner" style="background: ${myProfileBanner};"></div>
            <div class="user-avatar medium ${myAvatarFrame}" style="margin-top:-30px;">${renderAvatar(myAvatar, myAvatarFrame)}</div>
            <div>
                <div class="friend-name" style="font-size:1rem; font-weight:bold;">${myDisplayName} (Sen)</div>
                <div class="friend-tag">@${myUsername}</div>
            </div>
            <div class="profile-badges-row">${badgePills}</div>
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">${myAbout}</div>
        </div>
    `;
}

function openMyProfileSettingsModal() {
    if (profileDisplaynameInput) profileDisplaynameInput.value = myDisplayName;
    if (profileCustomstatusInput) profileCustomstatusInput.value = myCustomStatus;
    if (profileAboutInput) profileAboutInput.value = myAbout;
    if (profileAvatarUrlInput) profileAvatarUrlInput.value = myAvatar.startsWith('http') ? myAvatar : '';
    if (profileBannerUrlInput) profileBannerUrlInput.value = myProfileBanner.startsWith('http') ? myProfileBanner : '';
    updateLiveProfilePreview();
    if (profileModal) profileModal.classList.remove('hidden');
}

if (openProfileBtn) {
    openProfileBtn.addEventListener('click', openMyProfileSettingsModal);
}

if (myProfileNameTrigger) {
    myProfileNameTrigger.addEventListener('click', openMyProfileSettingsModal);
}

if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

if (profileModal) {
    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.add('hidden');
    });
}

if (tabProfGen) tabProfGen.addEventListener('click', () => switchProfTab('gen'));
if (tabProfDecor) tabProfDecor.addEventListener('click', () => switchProfTab('decor'));
if (tabProfAdmin) tabProfAdmin.addEventListener('click', () => switchProfTab('admin'));
if (tabProfAudio) tabProfAudio.addEventListener('click', () => switchProfTab('audio'));
if (tabProfTheme) tabProfTheme.addEventListener('click', () => switchProfTab('theme'));

function switchProfTab(tab) {
    tabProfGen.classList.toggle('active', tab === 'gen');
    tabProfDecor.classList.toggle('active', tab === 'decor');
    tabProfAdmin.classList.toggle('active', tab === 'admin');
    tabProfAudio.classList.toggle('active', tab === 'audio');
    tabProfTheme.classList.toggle('active', tab === 'theme');

    sectionProfGen.classList.toggle('hidden', tab !== 'gen');
    sectionProfDecor.classList.toggle('hidden', tab !== 'decor');
    sectionProfAdmin.classList.toggle('hidden', tab !== 'admin');
    sectionProfAudio.classList.toggle('hidden', tab !== 'audio');
    sectionProfTheme.classList.toggle('hidden', tab !== 'theme');
}

function updateLiveProfilePreview() {
    previewAvatarContainer.className = `user-avatar medium ${myAvatarFrame}`;
    previewAvatarContainer.innerHTML = renderAvatar(myAvatar, myAvatarFrame, avatarZoomSlider.value, avatarFitSelect.value);
    previewDisplayName.textContent = profileDisplaynameInput.value || myDisplayName;
    previewUserTag.textContent = '@' + myUsername;
    previewAboutText.textContent = profileAboutInput.value || myAbout;

    if (myProfileBanner.startsWith('http')) {
        previewCardBanner.style.backgroundImage = `url(${myProfileBanner})`;
    } else {
        previewCardBanner.style.background = myProfileBanner;
    }

    const badgePills = (myBadges || '🎮').split(',').map(b => `<span class="profile-badge-pill">${b}</span>`).join('');
    previewBadgesRow.innerHTML = badgePills;
}

if (profileDisplaynameInput) profileDisplaynameInput.addEventListener('input', updateLiveProfilePreview);
if (profileAboutInput) profileAboutInput.addEventListener('input', updateLiveProfilePreview);
if (profileAvatarUrlInput) {
    profileAvatarUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) { myAvatar = url; updateLiveProfilePreview(); }
    });
}
if (profileBannerUrlInput) {
    profileBannerUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) { myProfileBanner = url; updateLiveProfilePreview(); }
    });
}
if (profileAvatarFile) {
    profileAvatarFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) { myAvatar = evt.target.result; updateLiveProfilePreview(); };
            reader.readAsDataURL(file);
        }
    });
}
if (avatarZoomSlider) avatarZoomSlider.addEventListener('input', updateLiveProfilePreview);
if (avatarFitSelect) avatarFitSelect.addEventListener('change', updateLiveProfilePreview);

document.querySelectorAll('.avatar-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.avatar-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        myAvatar = btn.dataset.avatar;
        updateLiveProfilePreview();
    });
});

document.querySelectorAll('.frame-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.frame-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        myAvatarFrame = btn.dataset.frame;
        updateLiveProfilePreview();
    });
});

document.querySelectorAll('.banner-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.banner-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        myProfileBanner = btn.dataset.banner;
        updateLiveProfilePreview();
    });
});

if (adminAssignBadgeBtn) {
    adminAssignBadgeBtn.addEventListener('click', async () => {
        const targetUser = adminTargetUserInput.value.trim();
        if (!targetUser) { alert('Hedef kullanıcı adı girin!'); return; }

        const selectedBadges = [];
        document.querySelectorAll('#admin-badge-select-grid input:checked').forEach(cb => selectedBadges.push(cb.value));

        try {
            const res = await fetch('/api/admin/assign_badge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_user: myUsername,
                    target_user: targetUser,
                    badges: selectedBadges.join(',')
                })
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) loadFriendsList();
        } catch (e) { console.error(e); }
    });
}

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const newDisplayName = profileDisplaynameInput.value.trim();
        const newAbout = profileAboutInput.value.trim();
        const newCustomStatus = profileCustomstatusInput ? profileCustomstatusInput.value.trim() : '';

        if (!newDisplayName) return;

        myDisplayName = newDisplayName;
        myAbout = newAbout;
        myCustomStatus = newCustomStatus;
        updateProfileUI();

        try {
            await fetch('/api/profile/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: myUsername,
                    display_name: myDisplayName,
                    avatar: myAvatar,
                    about: myAbout,
                    avatar_frame: myAvatarFrame,
                    profile_banner: myProfileBanner,
                    custom_status: myCustomStatus
                })
            });
        } catch (e) { console.error(e); }

        profileModal.classList.add('hidden');
        loadFriendsList();
    });
}

socket.on('user_profile_updated', (data) => {
    if (data.username === myUsername && data.badges) myBadges = data.badges;
    loadFriendsList();
});

async function loadAudioDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        settingMicDevice.innerHTML = '';
        settingAudioDevice.innerHTML = '';

        devices.forEach(device => {
            const opt = document.createElement('option');
            opt.value = device.deviceId;
            if (device.kind === 'audioinput') {
                opt.textContent = device.label || `Mikrofon ${settingMicDevice.length + 1}`;
                settingMicDevice.appendChild(opt);
            } else if (device.kind === 'audiooutput') {
                opt.textContent = device.label || `Kulaklık ${settingAudioDevice.length + 1}`;
                settingAudioDevice.appendChild(opt);
            }
        });
    } catch (e) { console.error(e); }
}

if (settingAudioDevice) {
    settingAudioDevice.addEventListener('change', (e) => {
        selectedAudioOutputDeviceId = e.target.value;
        document.querySelectorAll('audio').forEach(audioEl => {
            if (typeof audioEl.setSinkId === 'function' && selectedAudioOutputDeviceId) {
                audioEl.setSinkId(selectedAudioOutputDeviceId).catch(console.error);
            }
        });
    });
}

if (settingOutputVolume) {
    settingOutputVolume.addEventListener('input', (e) => {
        const vol = e.target.value / 100;
        const valSpan = document.getElementById('output-vol-val');
        if (valSpan) valSpan.textContent = e.target.value;
        if (remoteDmAudio) remoteDmAudio.volume = vol;
        document.querySelectorAll('audio[id^="audio-"]').forEach(audioEl => {
            audioEl.volume = vol;
        });
    });
}

if (settingMicVolume) {
    settingMicVolume.addEventListener('input', (e) => {
        const valSpan = document.getElementById('mic-vol-val');
        if (valSpan) valSpan.textContent = e.target.value;
        if (micGainNode) micGainNode.gain.value = e.target.value / 100;
    });
}

// Global Mikrofon ve Sağırlaştırma (Deafen) Butonları
let isMicMutedGlobal = false;
let isDeafenedGlobal = false;

if (profileMicBtn) {
    profileMicBtn.addEventListener('click', () => {
        if (micToggleBtn && currentRoom) {
            micToggleBtn.click();
        } else {
            isMicMutedGlobal = !isMicMutedGlobal;
            profileMicBtn.innerHTML = isMicMutedGlobal ? '🔇' : '🎙️';
            profileMicBtn.classList.toggle('mic-off', isMicMutedGlobal);
            profileMicBtn.classList.toggle('mic-on', !isMicMutedGlobal);
            if (localAudioStream) {
                localAudioStream.getAudioTracks().forEach(t => t.enabled = !isMicMutedGlobal);
            }
            socket.emit('mute_status', { muted: isMicMutedGlobal });
        }
    });
}

if (profileDeafenBtn) {
    profileDeafenBtn.addEventListener('click', () => {
        isDeafenedGlobal = !isDeafenedGlobal;
        profileDeafenBtn.innerHTML = isDeafenedGlobal ? '🔇' : '🎧';
        profileDeafenBtn.classList.toggle('deafen-on', isDeafenedGlobal);
        profileDeafenBtn.classList.toggle('deafen-off', !isDeafenedGlobal);
        
        document.querySelectorAll('audio').forEach(a => a.muted = isDeafenedGlobal);
        if (isDeafenedGlobal && !isMicMutedGlobal && profileMicBtn) {
            profileMicBtn.click();
        }
    });
}

// =========================================================================
// GENEL ODA CHAT, TEPKİLER (EMOJIS) & RESIZERLAR
// =========================================================================

sendBtn.addEventListener('click', () => {
    const msg = chatInput.value.trim();
    if (msg) {
        addMessageToChat(myDisplayName, msg, 'my');
        socket.emit('send_message', { room: currentRoom, username: myDisplayName, message: msg });
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });
socket.on('receive_message', (data) => addMessageToChat(data.username, data.message, data.type));

function addMessageToChat(user, text, type, msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5)) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message chat-message ' + (type === 'my' ? 'my-message' : (type === 'system' ? 'system-message' : ''));
    msgDiv.id = 'chatmsg-' + msgId;
    msgDiv.style.position = 'relative';

    let contentHtml = text;
    if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com'))))) {
        contentHtml = `<img src="${text}" class="chat-img-attachment" referrerPolicy="no-referrer" crossOrigin="anonymous">`;
    }

    if (type === 'system') {
        msgDiv.innerHTML = `<span class="msg-text">${contentHtml}</span>`;
    } else {
        msgDiv.innerHTML = `
            <span class="msg-user">${user}</span><span class="msg-text">${contentHtml}</span>
            <div class="msg-reactions" id="chatreactions-${msgId}" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
            <div class="msg-reaction-btn chat-reaction-btn" onclick="showChatEmojiPicker('${msgId}', '${currentRoom}')" title="Tepki Ekle">😀</div>
        `;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Emoji Picker
const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];
let currentReactionContext = null;

function createEmojiPicker() {
    if (document.getElementById('emoji-picker-tooltip')) return;
    const picker = document.createElement('div');
    picker.id = 'emoji-picker-tooltip';
    picker.style.display = 'none';
    
    EMOJIS.forEach(emoji => {
        const span = document.createElement('span');
        span.className = 'emoji-option';
        span.textContent = emoji;
        span.onclick = () => handleEmojiSelect(emoji);
        picker.appendChild(span);
    });
    
    document.body.appendChild(picker);
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#emoji-picker-tooltip') && !e.target.classList.contains('msg-reaction-btn')) {
            picker.style.display = 'none';
        }
    });
}
createEmojiPicker();

window.showEmojiPicker = (msgId, pmTarget) => {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const picker = document.getElementById('emoji-picker-tooltip');
    picker.style.display = 'flex';
    picker.style.top = (rect.top - 40) + 'px';
    picker.style.left = (rect.left - 50) + 'px';
    currentReactionContext = { type: 'dm', msgId, target: pmTarget };
};

window.showChatEmojiPicker = (msgId, room) => {
    const btn = event.currentTarget;
    const rect = btn.getBoundingClientRect();
    const picker = document.getElementById('emoji-picker-tooltip');
    picker.style.display = 'flex';
    picker.style.top = (rect.top - 40) + 'px';
    picker.style.left = (rect.left - 50) + 'px';
    currentReactionContext = { type: 'room', msgId, target: room };
};

function handleEmojiSelect(emoji) {
    if (!currentReactionContext) return;
    const picker = document.getElementById('emoji-picker-tooltip');
    picker.style.display = 'none';
    
    socket.emit('add_reaction', {
        type: currentReactionContext.type,
        target: currentReactionContext.target,
        msgId: currentReactionContext.msgId,
        emoji: emoji,
        username: myUsername
    });
}

const localReactions = {};
socket.on('reaction_added', (data) => {
    const { msgId, emoji, username, type } = data;
    if (!localReactions[msgId]) localReactions[msgId] = {};
    if (!localReactions[msgId][emoji]) localReactions[msgId][emoji] = new Set();
    
    if (localReactions[msgId][emoji].has(username)) localReactions[msgId][emoji].delete(username);
    else localReactions[msgId][emoji].add(username);
    
    renderReactions(msgId, type);
});

function renderReactions(msgId, type) {
    const containerId = type === 'dm' ? 'reactions-' + msgId : 'chatreactions-' + msgId;
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    const reactions = localReactions[msgId];
    if (!reactions) return;
    
    Object.keys(reactions).forEach(emoji => {
        const users = reactions[emoji];
        if (users.size > 0) {
            const badge = document.createElement('span');
            badge.className = 'reaction-badge';
            if (users.has(myUsername)) badge.classList.add('active');
            badge.innerHTML = `${emoji} ${users.size}`;
            badge.onclick = () => {
                currentReactionContext = { type, msgId, target: currentRoom || currentPmTarget };
                handleEmojiSelect(emoji);
            };
            container.appendChild(badge);
        }
    });
}

// Resizerlar (Sidebar & Sağ Panel)
const resizerLeft = document.getElementById('resizer-left');
const discordSidebar = document.getElementById('discord-sidebar');
let isResizingLeft = false;

if (resizerLeft && discordSidebar) {
    resizerLeft.addEventListener('mousedown', () => {
        isResizingLeft = true;
        resizerLeft.classList.add('active');
        document.body.style.cursor = 'col-resize';
    });
}

const resizerRight = document.getElementById('resizer-right');
const rightPanel = document.getElementById('room-right-panel');
let isResizingRight = false;

if (resizerRight && rightPanel) {
    resizerRight.addEventListener('mousedown', () => {
        isResizingRight = true;
        resizerRight.classList.add('active');
        document.body.style.cursor = 'col-resize';
    });
}

document.addEventListener('mousemove', (e) => {
    if (isResizingLeft) {
        let newWidth = e.clientX - 72;
        newWidth = Math.max(200, Math.min(newWidth, 400));
        discordSidebar.style.width = newWidth + 'px';
    }
    if (isResizingRight) {
        let newWidth = window.innerWidth - e.clientX - 15;
        newWidth = Math.max(250, Math.min(newWidth, 450));
        rightPanel.style.width = newWidth + 'px';
        rightPanel.style.flex = `0 0 ${newWidth}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isResizingLeft) {
        isResizingLeft = false;
        if (resizerLeft) resizerLeft.classList.remove('active');
        document.body.style.cursor = '';
    }
    if (isResizingRight) {
        isResizingRight = false;
        if (resizerRight) resizerRight.classList.remove('active');
        document.body.style.cursor = '';
    }
});

// DM Call Boyutlandırma
if (embedResizeBtn) {
    embedResizeBtn.addEventListener('click', () => {
        const isExpanded = embeddedDmCall.classList.contains('expanded');
        if (isExpanded) {
            embeddedDmCall.classList.remove('expanded');
            embeddedDmCall.classList.add('compact');
            embeddedDmCall.style.height = '68px';
        } else {
            embeddedDmCall.classList.remove('compact');
            embeddedDmCall.classList.add('expanded');
            embeddedDmCall.style.height = '280px';
        }
    });
}

let isResizingCall = false;
let lastCallY = 0;
let initialCallH = 0;

if (callResizeHandle) {
    callResizeHandle.addEventListener('mousedown', (e) => {
        isResizingCall = true;
        lastCallY = e.clientY;
        initialCallH = embeddedDmCall.offsetHeight;
        document.body.style.cursor = 'ns-resize';
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isResizingCall) return;
    const dy = e.clientY - lastCallY;
    const newH = Math.max(68, Math.min(550, initialCallH + dy));
    embeddedDmCall.style.height = newH + 'px';
    if (newH > 100) {
        embeddedDmCall.classList.remove('compact');
        embeddedDmCall.classList.add('expanded');
    } else {
        embeddedDmCall.classList.remove('expanded');
        embeddedDmCall.classList.add('compact');
    }
});

document.addEventListener('mouseup', () => {
    if (isResizingCall) {
        isResizingCall = false;
        document.body.style.cursor = 'default';
    }
});

function initResizablePanels() {
    const leftSidebar = document.getElementById('discord-sidebar');
    const resizerLeft = document.getElementById('resizer-left');
    const rightPanel = document.getElementById('room-right-panel');
    const resizerRight = document.getElementById('resizer-right');

    const savedLeftWidth = localStorage.getItem('ordex_left_sidebar_w');
    const savedRightWidth = localStorage.getItem('ordex_right_sidebar_w');

    if (savedLeftWidth && leftSidebar) {
        leftSidebar.style.width = `${Math.max(200, Math.min(360, parseInt(savedLeftWidth)))}px`;
    }
    if (savedRightWidth && rightPanel) {
        rightPanel.style.width = `${Math.max(280, Math.min(500, parseInt(savedRightWidth)))}px`;
    }

    if (resizerLeft && leftSidebar) {
        let isDraggingLeft = false;
        resizerLeft.addEventListener('mousedown', (e) => {
            isDraggingLeft = true;
            resizerLeft.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingLeft) return;
            const newWidth = Math.max(200, Math.min(360, e.clientX));
            leftSidebar.style.width = `${newWidth}px`;
            localStorage.setItem('ordex_left_sidebar_w', newWidth);
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingLeft) {
                isDraggingLeft = false;
                resizerLeft.classList.remove('resizing');
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        });
    }

    if (resizerRight && rightPanel) {
        let isDraggingRight = false;
        resizerRight.addEventListener('mousedown', (e) => {
            isDraggingRight = true;
            resizerRight.classList.add('resizing');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingRight) return;
            const newWidth = Math.max(280, Math.min(500, window.innerWidth - e.clientX));
            rightPanel.style.width = `${newWidth}px`;
            localStorage.setItem('ordex_right_sidebar_w', newWidth);
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingRight) {
                isDraggingRight = false;
                resizerRight.classList.remove('resizing');
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        });
    }

    const toggleLeftBtn = document.getElementById('toggle-left-sidebar-btn');
    if (toggleLeftBtn && leftSidebar) {
        toggleLeftBtn.addEventListener('click', () => {
            leftSidebar.classList.toggle('collapsed');
            const isCollapsed = leftSidebar.classList.contains('collapsed');
            toggleLeftBtn.textContent = isCollapsed ? '▶' : '◀';
            toggleLeftBtn.setAttribute('data-tooltip', isCollapsed ? 'Sol Paneli Göster' : 'Sol Paneli Gizle');
        });
    }

    const toggleRightBtn = document.getElementById('toggle-room-right-panel-btn');
    if (toggleRightBtn && rightPanel) {
        toggleRightBtn.addEventListener('click', () => {
            rightPanel.classList.toggle('collapsed');
            const isCollapsed = rightPanel.classList.contains('collapsed');
            toggleRightBtn.textContent = isCollapsed ? '◀' : '▶';
            toggleRightBtn.setAttribute('data-tooltip', isCollapsed ? 'Sağ Paneli Göster' : 'Sağ Paneli Gizle');
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResizablePanels);
} else {
    initResizablePanels();
}

function unlockAudioAutoplay() {
    if (notifAudioCtx && notifAudioCtx.state === 'suspended') notifAudioCtx.resume().catch(() => {});
    if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
    pendingAudioElements.forEach(audioEl => {
        audioEl.play().then(() => {
            pendingAudioElements.delete(audioEl);
        }).catch(() => {});
    });
}
document.addEventListener('click', unlockAudioAutoplay);
document.addEventListener('keydown', unlockAudioAutoplay);
document.addEventListener('touchstart', unlockAudioAutoplay);
