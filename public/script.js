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

// Sunucu / Oda Bar & Sidebar
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

// Alt Kullanıcı Profil Barı
const myProfileTrigger = document.getElementById('my-profile-trigger');
const myProfileNameTrigger = document.getElementById('my-profile-name-trigger');
const myAvatarDisplay = document.getElementById('my-avatar-display');
const myDisplayNameEl = document.getElementById('my-display-name');
const myUsernameTagEl = document.getElementById('my-username-tag');
const profileMicBtn = document.getElementById('profile-mic-btn');
const openProfileBtn = document.getElementById('open-profile-btn');

// Friends Dashboard & DM Chat View
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

const dmRightSidebar = document.getElementById('dm-right-sidebar');
const rightSidebarMembersList = document.getElementById('right-sidebar-members-list');

// EMBEDDED CALL & ACTIVE CALL STRIP
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

// Oda Görünümü & Kontroller
const currentRoomDisplay = document.getElementById('current-room');
const roleBadge = document.getElementById('role-badge');
const leaveRoomBtn = document.getElementById('leave-room-btn');
const watchPartyUI = document.getElementById('watch-party-ui');
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

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const micToggleBtn = document.getElementById('mic-toggle-btn');
const shareScreenBtn = document.getElementById('share-screen-btn');
const voiceUsersList = document.getElementById('voice-users-list');

// Modallar & Profil Elemanları
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

// Live Preview DOM
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
const profileAboutInput = document.getElementById('profile-about-input');

const adminTargetUserInput = document.getElementById('admin-target-user-input');
const adminAssignBadgeBtn = document.getElementById('admin-assign-badge-btn');

const settingMicDevice = document.getElementById('setting-mic-device');
const settingAudioDevice = document.getElementById('setting-audio-device');
const settingOutputVolume = document.getElementById('setting-output-volume');
const settingMicVolume = document.getElementById('setting-mic-volume');

const saveProfileBtn = document.getElementById('save-profile-btn');
const closeProfileBtn = document.getElementById('close-profile-btn');

const incomingCallModal = document.getElementById('incoming-call-modal');
const incomingCallerName = document.getElementById('incoming-caller-name');
const incomingCallAvatar = document.getElementById('incoming-call-avatar');
const incomingCallTypeText = document.getElementById('incoming-call-type-text');
const acceptCallBtn = document.getElementById('accept-call-btn');
const rejectCallBtn = document.getElementById('reject-call-btn');

// --- DURUM DEĞİŞKENLERİ ---
let myUsername = '';
let myDisplayName = '';
let myAvatar = '🎮';
let myAbout = 'Siberpunk platform sakini.';
let myAvatarFrame = 'none';
let myProfileBanner = 'linear-gradient(135deg, #00f0ff, #8a2be2)';
let myBadges = '⚡,🎮';
let myIsAdmin = 0;
let currentTheme = localStorage.getItem('ordex_theme') || 'theme-cyan';

let currentRoom = '';
let currentRoomType = 'watch';
let pendingJoinRoom = null;

let isSyncing = false;
let authMode = 'login';
let isYoutubeMode = false;
let ytPlayer = null;
let ytApiReady = false;
let isHost = false;
let isScreenSharing = false;

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

// Oda WebRTC
let localAudioStream = null;
let localScreenStream = null;
const peers = {};
const rtcConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};
let audioContext;
let micGainNode;
const pendingAudioPlays = [];

// AVATAR VE ÇERÇEVE RENDER YARDIMCISI
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

window.onYouTubeIframeAPIReady = function() {
    ytApiReady = true;
};

// SOCKET RE-REGISTRATION ON RECONNECT
socket.on('connect', () => {
    if (myUsername) {
        socket.emit('register_user', {
            username: myUsername,
            display_name: myDisplayName,
            avatar: myAvatar,
            avatar_frame: myAvatarFrame,
            profile_banner: myProfileBanner,
            badges: myBadges,
            is_admin: myIsAdmin
        });
    }
});

// --- GİRİŞ VE HIZLI HESAP DEĞİŞTİRME (ACCOUNT SWITCHER) ---
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

openAccountSwitchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    renderSavedAccountsMenu();
    accountSwitcherMenu.classList.toggle('hidden');
});

addNewAccountBtn.addEventListener('click', () => {
    accountSwitcherMenu.classList.add('hidden');
    appLayout.classList.add('hidden');
    authView.classList.remove('hidden');
    authUsernameInput.value = '';
    authPasswordInput.value = '';
});

document.addEventListener('click', () => {
    if (!accountSwitcherMenu.classList.contains('hidden')) {
        accountSwitcherMenu.classList.add('hidden');
    }
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
                if (authMode === 'register') {
                    authMessage.style.color = '#00f0ff';
                    authMessage.textContent = 'Kayıt başarılı! Giriş yapabilirsiniz.';
                    switchTab('login');
                } else {
                    data.user.password = password;
                    saveSavedAccount(data.user);
                    enterApp(data.user);
                }
            } else {
                authMessage.style.color = '#ff3366';
                authMessage.textContent = data.message;
            }
        } catch (e) {
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
        is_admin: myIsAdmin
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
}

// KENDİ PROFİLİNE TIKLAYINCA DİREKT GÖRME HAKKI
myProfileTrigger.addEventListener('click', openMyOwnProfileInSidebar);
myProfileNameTrigger.addEventListener('click', openMyOwnProfileInSidebar);

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

// --- PROFİL VE CANLI ÖN İZLEME (LIVE PREVIEW) MODALI ---
openProfileBtn.addEventListener('click', () => {
    profileDisplaynameInput.value = myDisplayName;
    profileAboutInput.value = myAbout;
    profileAvatarUrlInput.value = myAvatar.startsWith('http') ? myAvatar : '';
    profileBannerUrlInput.value = myProfileBanner.startsWith('http') ? myProfileBanner : '';
    updateLiveProfilePreview();
    profileModal.classList.remove('hidden');
});

closeProfileBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
});

tabProfGen.addEventListener('click', () => switchProfTab('gen'));
tabProfDecor.addEventListener('click', () => switchProfTab('decor'));
tabProfAdmin.addEventListener('click', () => switchProfTab('admin'));
tabProfAudio.addEventListener('click', () => switchProfTab('audio'));
tabProfTheme.addEventListener('click', () => switchProfTab('theme'));

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

// CANLI ÖN İZLEME (LIVE PROFILE PREVIEW) GÜNCELLEME
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

profileDisplaynameInput.addEventListener('input', updateLiveProfilePreview);
profileAboutInput.addEventListener('input', updateLiveProfilePreview);

profileAvatarUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        myAvatar = url;
        updateLiveProfilePreview();
    }
});

profileBannerUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
        myProfileBanner = url;
        updateLiveProfilePreview();
    }
});

profileAvatarFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            myAvatar = evt.target.result;
            updateLiveProfilePreview();
        };
        reader.readAsDataURL(file);
    }
});

avatarZoomSlider.addEventListener('input', updateLiveProfilePreview);
avatarFitSelect.addEventListener('change', updateLiveProfilePreview);

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

// ADMİN ROZET ATAMA BUTONU
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
        if (data.success) {
            loadFriendsList();
        }
    } catch (e) { console.error(e); }
});

saveProfileBtn.addEventListener('click', async () => {
    const newDisplayName = profileDisplaynameInput.value.trim();
    const newAbout = profileAboutInput.value.trim();

    if (!newDisplayName) return;

    myDisplayName = newDisplayName;
    myAbout = newAbout;
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
                profile_banner: myProfileBanner
            })
        });
    } catch (e) { console.error(e); }

    profileModal.classList.add('hidden');
    loadFriendsList();
});

socket.on('user_profile_updated', (data) => {
    if (data.username === myUsername && data.badges) {
        myBadges = data.badges;
    }
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

settingOutputVolume.addEventListener('input', (e) => {
    const vol = e.target.value / 100;
    document.getElementById('output-vol-val').textContent = e.target.value;
    if (remoteDmAudio) remoteDmAudio.volume = vol;
});

settingMicVolume.addEventListener('input', (e) => {
    document.getElementById('mic-vol-val').textContent = e.target.value;
    if (micGainNode) micGainNode.gain.value = e.target.value / 100;
});

// --- ARKADAŞLIK, DİREKT MESAJ VE GRUP SEKMELERİ ---
tabFriendsAll.addEventListener('click', () => setFriendsFilter('all'));
tabFriendsOnline.addEventListener('click', () => setFriendsFilter('online'));
tabGroupsList.addEventListener('click', () => setFriendsFilter('groups'));
tabFriendsAdd.addEventListener('click', () => setFriendsFilter('add'));

function setFriendsFilter(filter) {
    friendsFilter = filter;
    tabFriendsAll.classList.remove('active');
    tabFriendsOnline.classList.remove('active');
    tabGroupsList.classList.remove('active');
    tabFriendsAdd.classList.remove('active');
    
    if (filter === 'all') tabFriendsAll.classList.add('active');
    else if (filter === 'online') tabFriendsOnline.classList.add('active');
    else if (filter === 'groups') tabGroupsList.classList.add('active');
    else if (filter === 'add') tabFriendsAdd.classList.add('active');

    addFriendContainer.classList.toggle('hidden', filter !== 'add');
    groupActionsBar.classList.toggle('hidden', filter !== 'groups');

    if (filter === 'groups') renderGroupsList(activeGroupsList);
    else renderFriendsList(activeFriendsList);
}

document.querySelectorAll('.group-avatar-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.group-avatar-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedGroupAvatar = btn.dataset.gavatar;
    });
});

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

closeCreateGroupBtn.addEventListener('click', () => createGroupModal.classList.add('hidden'));

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

toggleRightSidebarBtn.addEventListener('click', () => {
    dmRightSidebar.classList.toggle('hidden');
});

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
            <div class="member-info-left">
                <div class="user-avatar small ${m.avatarFrame || 'none'}">${renderAvatar(m.avatar, m.avatarFrame)}</div>
                <div class="friend-names">
                    <span class="friend-name">${m.displayName} ${m.isAdmin ? '👑' : ''}</span>
                    <span class="friend-tag">@${m.username}</span>
                </div>
            </div>
            ${kickBtn}
        `;
        rightSidebarMembersList.appendChild(mDiv);
    });

    pmMessagesContainer.innerHTML = '<div style="color:#666; text-align:center;">Grup Sohbeti Hazır.</div>';
}

window.kickGroupMember = async function(groupId, targetUser) {
    if (!confirm(`${targetUser} kullanıcısını gruptan atmak istiyor musunuz?`)) return;
    try {
        const res = await fetch('/api/groups/kick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ group_id: groupId, leader: myUsername, target_user: targetUser })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) loadGroupsList();
    } catch (e) { console.error(e); }
};

socket.on('kicked_from_group', () => {
    alert('Bir gruptan çıkarıldınız.');
    loadGroupsList();
});

socket.on('groups_updated', () => loadGroupsList());

addFriendBtn.addEventListener('click', async () => {
    const friendName = addFriendInput.value.trim();
    if (!friendName) return;
    try {
        const res = await fetch('/api/friends/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: myUsername, friendName })
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            addFriendInput.value = '';
            loadFriendsList();
        }
    } catch (e) { console.error(e); }
});

async function loadFriendsList() {
    if (!myUsername) return;
    try {
        const res = await fetch(`/api/friends/list?username=${encodeURIComponent(myUsername)}`);
        const data = await res.json();
        if (data.success) {
            activeFriendsList = data.friends;
            if (friendsFilter !== 'groups') renderFriendsList(activeFriendsList);
        }
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
        const item = document.createElement('div');
        item.className = `friend-item ${currentPmTarget === f.username ? 'active' : ''}`;
        const unreadCount = unreadMessages[f.username] || 0;
        const badgeHtml = unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : '';

        item.innerHTML = `
            <div class="friend-info">
                <div class="user-avatar small ${f.avatarFrame || 'none'}">${renderAvatar(f.avatar, f.avatarFrame)}</div>
                <div class="friend-names">
                    <span class="friend-name">${f.displayName} ${f.isAdmin ? '👑' : ''}</span>
                    <span class="friend-tag">@${f.username}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <span class="status-dot ${f.isOnline ? 'online' : ''}"></span>
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
                    <span class="friend-tag">@${f.username}</span>
                </div>
            </div>
            <button class="cyber-btn small">Mesaj Gönder</button>
        `;
        card.querySelector('button').addEventListener('click', () => openPrivateChat(f));
        friendsCardsGrid.appendChild(card);
    });
}

function switchMainView(view) {
    if (view === 'friends') {
        friendsView.classList.remove('hidden');
        roomView.classList.add('hidden');
        homeDmBtn.classList.add('active-server');
        document.querySelectorAll('.server-icon.room-icon').forEach(el => el.classList.remove('active-server'));
        if (isInCall && dmChatContainer.classList.contains('hidden')) {
            activeCallStrip.classList.remove('hidden');
        }
    } else if (view === 'room') {
        friendsView.classList.add('hidden');
        roomView.classList.remove('hidden');
        homeDmBtn.classList.remove('active-server');
        if (isInCall) {
            activeCallStrip.classList.remove('hidden');
        }
    }
}

homeDmBtn.addEventListener('click', () => switchMainView('friends'));

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
    pmTargetStatusDot.textContent = friendObj.isOnline ? '• Çevrimiçi' : '• Çevrimdışı';
    pmTargetStatusDot.className = `status-text ${friendObj.isOnline ? 'online' : ''}`;

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
            <div style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">${friendObj.about || 'Siberpunk platform sakini.'}</div>
        </div>
    `;

    pmMessagesContainer.innerHTML = '<div style="color:#666; text-align:center;">Mesajlar Yükleniyor...</div>';

    try {
        const res = await fetch(`/api/pm/history?user1=${encodeURIComponent(myUsername)}&user2=${encodeURIComponent(friendObj.username)}`);
        const data = await res.json();
        pmMessagesContainer.innerHTML = '';
        if (data.success) {
            data.history.forEach(msg => {
                appendPmMessage(msg.sender, msg.message);
            });
            pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
        }
    } catch (e) { console.error(e); }
}

function appendPmMessage(sender, text) {
    const isMy = sender === myUsername;
    const msgDiv = document.createElement('div');
    msgDiv.className = `dm-message ${isMy ? 'my-pm' : 'other-pm'}`;
    
    let contentHtml = text;
    if (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com')))) {
        contentHtml = `<img src="${text}" class="chat-img-attachment">`;
    }

    msgDiv.innerHTML = `
        <div class="dm-sender">${isMy ? myDisplayName : sender}</div>
        <div class="dm-text">${contentHtml}</div>
    `;
    pmMessagesContainer.appendChild(msgDiv);
    pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
}

pmSendBtn.addEventListener('click', sendPm);
pmInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendPm(); });

function sendPm() {
    const text = pmInput.value.trim();
    if (text && currentPmTarget) {
        socket.emit('send_private_message', {
            sender: myUsername,
            receiver: currentPmTarget,
            message: text
        });
        pmInput.value = '';
        loadFriendsList();
    }
}

// FOTOĞRAF / GÖRSEL GÖNDERME (ATTACHMENT & DRAG-AND-DROP)
attachFileBtn.addEventListener('click', () => chatFileInput.click());

chatFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && currentPmTarget) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            socket.emit('send_private_message', {
                sender: myUsername,
                receiver: currentPmTarget,
                message: evt.target.result
            });
            loadFriendsList();
        };
        reader.readAsDataURL(file);
    }
});

chatDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    chatDragOverlay.classList.remove('hidden');
});

chatDropZone.addEventListener('dragleave', () => {
    chatDragOverlay.classList.add('hidden');
});

chatDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    chatDragOverlay.classList.add('hidden');
    if (e.dataTransfer.files && e.dataTransfer.files[0] && currentPmTarget) {
        const file = e.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = function(evt) {
            socket.emit('send_private_message', {
                sender: myUsername,
                receiver: currentPmTarget,
                message: evt.target.result
            });
            loadFriendsList();
        };
        reader.readAsDataURL(file);
    }
});

// TENOR GIF ENTEGRASYONU & ARAMASI
openGifBtn.addEventListener('click', () => {
    loadTrendingGifs();
    gifPickerModal.classList.remove('hidden');
});

closeGifModalBtn.addEventListener('click', () => gifPickerModal.classList.add('hidden'));

async function loadTrendingGifs(query = 'cyberpunk') {
    gifResultsGrid.innerHTML = '<div style="color:#888; text-align:center; grid-column:span 3;">GIF\'ler Yükleniyor...</div>';
    try {
        const res = await fetch(`https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=LIVDSRZULEXM&limit=12`);
        const data = await res.json();
        gifResultsGrid.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(item => {
                const gifUrl = item.media[0].gif.url;
                const img = document.createElement('img');
                img.className = 'gif-thumb-item';
                img.src = item.media[0].tinyscan ? item.media[0].tinyscan.url : gifUrl;
                img.addEventListener('click', () => {
                    if (currentPmTarget) {
                        socket.emit('send_private_message', {
                            sender: myUsername,
                            receiver: currentPmTarget,
                            message: gifUrl
                        });
                        gifPickerModal.classList.add('hidden');
                        loadFriendsList();
                    }
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

gifSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const q = gifSearchInput.value.trim();
        if (q) loadTrendingGifs(q);
    }
});

socket.on('receive_private_message', (data) => {
    const otherUser = data.sender === myUsername ? data.receiver : data.sender;
    if (currentPmTarget === otherUser && !dmChatContainer.classList.contains('hidden')) {
        appendPmMessage(data.sender, data.message);
    } else {
        if (data.sender !== myUsername) {
            unreadMessages[otherUser] = (unreadMessages[otherUser] || 0) + 1;
            loadFriendsList();
        }
    }
});

socket.on('user_status_change', () => { loadFriendsList(); });
socket.on('friends_updated', () => { loadFriendsList(); });

// --- EMBEDDED DM CALL SÜRÜKLEYEREK BOYUTLANDIRMA VE BÜYÜTME ---
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

let isResizingCall = false;
let lastCallY = 0;
let initialCallH = 0;

callResizeHandle.addEventListener('mousedown', (e) => {
    isResizingCall = true;
    lastCallY = e.clientY;
    initialCallH = embeddedDmCall.offsetHeight;
    document.body.style.cursor = 'ns-resize';
});

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

// --- DISCORD GÖMÜLÜ DM WEBRTC ARAMA SİSTEMİ ---
startVoiceCallBtn.addEventListener('click', () => startDmCall('voice'));
startVideoCallBtn.addEventListener('click', () => startDmCall('video'));

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
        localDmStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
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
});

acceptCallBtn.addEventListener('click', async () => {
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
        localDmStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
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

rejectCallBtn.addEventListener('click', () => {
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
    if (dmPeerConnection) {
        await dmPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
});

embedEndCallBtn.addEventListener('click', () => {
    socket.emit('dm_call_end', { target: dmCallTarget, sender: myUsername });
    endDmCall();
});

callStripEndBtn.addEventListener('click', () => {
    socket.emit('dm_call_end', { target: dmCallTarget, sender: myUsername });
    endDmCall();
});

callStripReturnBtn.addEventListener('click', () => {
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
        dmPeerConnection.close();
        dmPeerConnection = null;
    }
    embeddedDmCall.classList.add('hidden');
    activeCallStrip.classList.add('hidden');
    isInCall = false;
    dmCallTarget = null;
}

embedToggleMicBtn.addEventListener('click', () => {
    if (localDmStream) {
        const audioTrack = localDmStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            embedToggleMicBtn.textContent = audioTrack.enabled ? '🎙️' : '🔇';
            callStripMicBtn.textContent = audioTrack.enabled ? '🎙️' : '🔇';
        }
    }
});

embedToggleCamBtn.addEventListener('click', () => {
    if (localDmStream) {
        const videoTrack = localDmStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            embedToggleCamBtn.textContent = videoTrack.enabled ? '📹' : '🚫';
            localDmVideo.style.display = videoTrack.enabled ? 'block' : 'none';
        }
    }
});

// --- DISCORD TİPİ ODA / SUNUCU VE ODA HOST KICKİ ---
createRoomModalBtn.addEventListener('click', () => { createRoomModal.classList.remove('hidden'); });
closeCreateRoomBtn.addEventListener('click', () => { createRoomModal.classList.add('hidden'); });

createRoomBtn.addEventListener('click', () => {
    const roomName = newRoomNameInput.value.trim();
    const roomType = newRoomTypeSelect.value;
    if (roomName) {
        createRoomModal.classList.add('hidden');
        joinRoom(roomName, roomType);
    }
});

socket.on('room_list', (rooms) => {
    sidebarRoomsList.innerHTML = '';
    const roomNames = Object.keys(rooms);
    
    roomNames.forEach(roomName => {
        const roomData = rooms[roomName];
        const btn = document.createElement('button');
        btn.className = `server-icon room-icon ${currentRoom === roomName ? 'active-server' : ''}`;
        btn.title = `${roomName} (${roomData.count} Kişi)`;
        
        const emoji = roomData.type === 'screen' ? '💻' : '🎬';
        btn.innerHTML = `
            <span>${emoji}</span>
            <span class="server-badge">${roomData.count}</span>
        `;
        
        btn.addEventListener('click', () => promptJoinRoom(roomName, roomData.type));
        sidebarRoomsList.appendChild(btn);
    });
});

function promptJoinRoom(roomName, roomType) {
    if (currentRoom === roomName) {
        switchMainView('room');
        return;
    }
    pendingJoinRoom = { roomName, roomType };
    joinRoomModalText.textContent = `"${roomName}" odasına katılmak istiyor musunuz?`;
    joinRoomModal.classList.remove('hidden');
}

confirmJoinRoomBtn.addEventListener('click', () => {
    if (pendingJoinRoom) {
        joinRoomModal.classList.add('hidden');
        joinRoom(pendingJoinRoom.roomName, pendingJoinRoom.roomType);
        pendingJoinRoom = null;
    }
});

cancelJoinRoomBtn.addEventListener('click', () => {
    joinRoomModal.classList.add('hidden');
    pendingJoinRoom = null;
});

async function joinRoom(roomName, roomType) {
    currentRoom = roomName;
    switchMainView('room');
    currentRoomDisplay.textContent = currentRoom;

    document.querySelectorAll('.server-icon.room-icon').forEach(el => {
        if (el.title.startsWith(roomName)) el.classList.add('active-server');
        else el.classList.remove('active-server');
    });

    try {
        await requestMicrophonePermission();
    } catch (e) {
        console.warn('Microphone permission skipped or failed:', e);
    }
    socket.emit('join_room', { username: myUsername, room: currentRoom, room_type: roomType });
}

leaveRoomBtn.addEventListener('click', leaveCurrentRoom);

function leaveCurrentRoom() {
    if (currentRoom) {
        socket.emit('leave_room_event', {});
        currentRoom = '';
        switchMainView('friends');
        friendsDashboard.classList.remove('hidden');
        dmChatContainer.classList.add('hidden');
    }
}

function setupRoomUI(type) {
    currentRoomType = type;
    if (type === 'screen') {
        watchPartyUI.classList.add('hidden');
        videoControlsBar.classList.add('hidden');
        queueSectionBox.classList.add('hidden');
        screenShareUI.classList.remove('hidden');
        shareScreenBtn.classList.remove('hidden');
    } else {
        watchPartyUI.classList.remove('hidden');
        videoControlsBar.classList.remove('hidden');
        queueSectionBox.classList.remove('hidden');
        screenShareUI.classList.add('hidden');
        shareScreenBtn.classList.add('hidden');
    }
}

socket.on('room_info', (data) => {
    isHost = data.is_host;
    setupRoomUI(data.type);
    
    if (isHost) {
        roleBadge.textContent = 'Oda Sahibi';
        roleBadge.style.background = 'rgba(0, 240, 255, 0.2)';
        roleBadge.style.color = 'var(--neon-cyan)';
        loadVideoBtn.textContent = 'Doğrudan Oynat';
        if (currentRoomType === 'watch') nextVideoBtn.classList.remove('hidden');
        videoPlayer.controls = true;
    } else {
        roleBadge.textContent = 'İzleyici';
        roleBadge.style.background = 'rgba(255,255,255,0.1)';
        roleBadge.style.color = '#fff';
        loadVideoBtn.textContent = 'Sıraya İstek Gönder';
        nextVideoBtn.classList.add('hidden');
        videoPlayer.controls = false;
    }
});

socket.on('update_queue', (data) => {
    queueListContainer.innerHTML = '';
    if (data.queue.length === 0) {
        queueListContainer.innerHTML = '<p style="color:#666; font-size:0.9rem; text-align:center; padding:10px;">Sırada video yok.</p>';
        return;
    }
    data.queue.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'queue-item';
        div.innerHTML = `
            <div style="font-size:0.85rem; color:#fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;">
                ${index + 1}. ${item.url}
            </div>
            <div style="font-size:0.75rem; color:var(--neon-cyan);">İsteyen: ${item.requested_by}</div>
        `;
        queueListContainer.appendChild(div);
    });
});

loadVideoBtn.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (!url) return;
    if (isHost) {
        handleVideoLoading(url);
        socket.emit('load_video', { room: currentRoom, videoUrl: url });
    } else {
        socket.emit('request_video', { videoUrl: url });
    }
    videoUrlInput.value = '';
});

nextVideoBtn.addEventListener('click', () => {
    if (isHost) socket.emit('next_video', { room: currentRoom });
});

async function requestMicrophonePermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
        localAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localAudioStream.getAudioTracks()[0].enabled = false;
        socket.emit('mute_status', { muted: true });

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(localAudioStream);
        micGainNode = audioContext.createGain();
        source.connect(micGainNode);

        monitorAudio(localAudioStream, socket.id);
    } catch (e) {
        addMessageToChat('Sistem', 'Sesli konuşma için mikrofon erişimi reddedildi.', 'system');
    }
}

shareScreenBtn.addEventListener('click', async () => {
    if (!isScreenSharing) {
        try {
            localScreenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 60 } },
                audio: true
            });
            isScreenSharing = true;
            shareScreenBtn.textContent = 'Ekranı Durdur';
            renderScreenShare(socket.id, myDisplayName, localScreenStream);

            localScreenStream.getTracks().forEach(track => {
                for (let sid in peers) { peers[sid].addTrack(track, localScreenStream); }
                track.onended = () => { stopScreenSharing(); };
            });
        } catch (err) { console.error(err); }
    } else {
        stopScreenSharing();
    }
});

function stopScreenSharing() {
    if (localScreenStream) {
        localScreenStream.getTracks().forEach(track => track.stop());
        localScreenStream = null;
    }
    isScreenSharing = false;
    shareScreenBtn.textContent = 'Ekran Paylaş';
    removeScreenShare(socket.id);
}

function renderScreenShare(sid, username, stream) {
    noScreenMsg.style.display = 'none';
    let container = document.getElementById('screen-container-' + sid);
    if (!container) {
        container = document.createElement('div');
        container.id = 'screen-container-' + sid;
        container.className = 'shared-screen-item';
        container.innerHTML = `<video id="screen-video-${sid}" autoplay playsinline></video><div class="screen-label">${username}'s Screen</div>`;
        
        container.addEventListener('click', () => {
            const isFocused = container.classList.contains('focused-stream');
            document.querySelectorAll('.shared-screen-item').forEach(el => el.classList.remove('focused-stream'));
            if (!isFocused) container.classList.add('focused-stream');
        });

        screenShareUI.appendChild(container);
    }
    document.getElementById(`screen-video-${sid}`).srcObject = stream;
}

function removeScreenShare(sid) {
    const container = document.getElementById('screen-container-' + sid);
    if (container) container.remove();
    if (screenShareUI.querySelectorAll('.shared-screen-item').length === 0) {
        noScreenMsg.style.display = 'block';
    }
}

function renderVoiceUser(sid, username, isMuted) {
    let div = document.getElementById('voice-user-' + sid);
    if (!div) {
        div = document.createElement('div');
        div.id = 'voice-user-' + sid;
        div.className = 'voice-user';
        voiceUsersList.appendChild(div);
    }
    const isMe = sid === socket.id;
    const kickBtn = (isHost && !isMe) 
        ? `<button class="kick-btn" onclick="kickRoomUser('${sid}')">🚫 At</button>` 
        : '';

    div.innerHTML = `
        <span class="voice-user-name" style="${isMe ? 'color: var(--neon-purple);' : ''}">${isMe ? username + ' (Sen)' : username}</span>
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

socket.on('room_users_list', (users) => {
    voiceUsersList.innerHTML = '';
    users.forEach(u => renderVoiceUser(u.sid, u.username, u.muted));
});
socket.on('user_joined', (data) => renderVoiceUser(data.sid, data.username, data.muted));
socket.on('user_left', (data) => {
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

micToggleBtn.addEventListener('click', async () => {
    if (!localAudioStream) { await requestMicrophonePermission(); if (!localAudioStream) return; }
    const track = localAudioStream.getAudioTracks()[0];
    track.enabled = !track.enabled;
    const isMuted = !track.enabled;
    socket.emit('mute_status', { muted: isMuted });
    micToggleBtn.textContent = isMuted ? 'Sesi Aç' : 'Sesi Kapat';
    profileMicBtn.textContent = isMuted ? '🔇' : '🎙️';
    renderVoiceUser(socket.id, myDisplayName, isMuted);
});

profileMicBtn.addEventListener('click', () => { micToggleBtn.click(); });

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
            if (avg > 15) userDiv.classList.add('speaking');
            else userDiv.classList.remove('speaking');
        }
        requestAnimationFrame(checkAudio);
    }
    checkAudio();
}

function createPeerConnection(targetSid) {
    const pc = new RTCPeerConnection(rtcConfig);
    peers[targetSid] = pc;
    if (localAudioStream) localAudioStream.getTracks().forEach(track => pc.addTrack(track, localAudioStream));
    if (localScreenStream) localScreenStream.getTracks().forEach(track => pc.addTrack(track, localScreenStream));
    
    pc.onnegotiationneeded = async () => {
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('webrtc_offer', { target_sid: targetSid, sender_sid: socket.id, offer: pc.localDescription });
        } catch (err) { console.error(err); }
    };
    pc.onicecandidate = (event) => {
        if (event.candidate) socket.emit('webrtc_ice_candidate', { target_sid: targetSid, sender_sid: socket.id, candidate: event.candidate });
    };
    pc.ontrack = (event) => {
        if (event.track.kind === 'video') {
            renderScreenShare(targetSid, 'Yayın', event.streams[0]);
        } else if (event.track.kind === 'audio') {
            let audioEl = document.getElementById('audio-' + targetSid);
            if (!audioEl) {
                audioEl = document.createElement('audio');
                audioEl.id = 'audio-' + targetSid;
                audioEl.autoplay = true;
                document.body.appendChild(audioEl);
            }
            audioEl.srcObject = event.streams[0];
            audioEl.play().catch(() => pendingAudioPlays.push(audioEl));
            monitorAudio(event.streams[0], targetSid);
        }
    };
    return pc;
}

socket.on('user_joined', async (data) => { createPeerConnection(data.sid); });
socket.on('webrtc_offer', async (data) => {
    let pc = peers[data.sender_sid];
    if (!pc) pc = createPeerConnection(data.sender_sid);
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('webrtc_answer', { target_sid: data.sender_sid, sender_sid: socket.id, answer: answer });
});
socket.on('webrtc_answer', async (data) => { if (peers[data.sender_sid]) await peers[data.sender_sid].setRemoteDescription(new RTCSessionDescription(data.answer)); });
socket.on('webrtc_ice_candidate', async (data) => { if (peers[data.sender_sid]) await peers[data.sender_sid].addIceCandidate(new RTCIceCandidate(data.candidate)); });
socket.on('user_left', (data) => {
    if (peers[data.sid]) { peers[data.sid].close(); delete peers[data.sid]; }
    const audioEl = document.getElementById('audio-' + data.sid); if (audioEl) audioEl.remove();
});

// --- YOUTUBE & VIDEO OYNATICI ---
function extractYouTubeId(url) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    return null;
}

function handleVideoLoading(url) {
    const ytId = extractYouTubeId(url);
    if (ytId) {
        isYoutubeMode = true;
        videoPlayer.style.display = 'none';
        videoPlayer.pause();
        youtubeContainer.style.display = 'block';

        if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
            ytPlayer.loadVideoById(ytId);
        } else if (ytApiReady) {
            ytPlayer = new YT.Player('yt-player', {
                height: '100%', width: '100%', videoId: ytId,
                playerVars: { 'autoplay': 1, 'controls': isHost ? 1 : 0, 'rel': 0 },
                events: { 'onStateChange': onYoutubePlayerStateChange }
            });
        }
    } else {
        isYoutubeMode = false;
        youtubeContainer.style.display = 'none';
        videoPlayer.style.display = 'block';
        videoPlayer.src = url;
        videoPlayer.load();
    }
}

function onYoutubePlayerStateChange(event) {
    if (isSyncing || !isYoutubeMode || !isHost) return;
    const currentTime = ytPlayer.getCurrentTime();
    if (event.data === YT.PlayerState.PLAYING) socket.emit('play_video', { room: currentRoom, time: currentTime });
    else if (event.data === YT.PlayerState.PAUSED) socket.emit('pause_video', { room: currentRoom, time: currentTime });
}

socket.on('load_video', (data) => handleVideoLoading(data.videoUrl));

videoPlayer.addEventListener('play', () => { if (!isSyncing && !isYoutubeMode && isHost) socket.emit('play_video', { room: currentRoom, time: videoPlayer.currentTime }); });
videoPlayer.addEventListener('pause', () => { if (!isSyncing && !isYoutubeMode && isHost) socket.emit('pause_video', { room: currentRoom, time: videoPlayer.currentTime }); });
videoPlayer.addEventListener('seeked', () => { if (!isSyncing && !isYoutubeMode && isHost) socket.emit('seek_video', { room: currentRoom, time: videoPlayer.currentTime }); });

socket.on('play_video', (data) => {
    isSyncing = true;
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.playVideo === 'function') {
        if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
        ytPlayer.playVideo();
    } else if (!isYoutubeMode) {
        if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
        videoPlayer.play().catch(() => {});
    }
    setTimeout(() => { isSyncing = false; }, 600);
});

socket.on('pause_video', (data) => {
    isSyncing = true;
    if (isYoutubeMode && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
        ytPlayer.pauseVideo();
        if (Math.abs(ytPlayer.getCurrentTime() - data.time) > 1.5) ytPlayer.seekTo(data.time, true);
    } else if (!isYoutubeMode) {
        videoPlayer.pause();
        if (Math.abs(videoPlayer.currentTime - data.time) > 1.5) videoPlayer.currentTime = data.time;
    }
    setTimeout(() => { isSyncing = false; }, 600);
});

socket.on('seek_video', (data) => {
    if (isYoutubeMode) return;
    isSyncing = true;
    videoPlayer.currentTime = data.time;
    setTimeout(() => { isSyncing = false; }, 600);
});

// --- CHAT ALANI ---
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

function addMessageToChat(user, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (type === 'my' ? 'my-message' : (type === 'system' ? 'system-message' : ''));
    if (type === 'system') msgDiv.innerHTML = `<span class="msg-text">${text}</span>`;
    else msgDiv.innerHTML = `<span class="msg-user">${user}</span><span class="msg-text">${text}</span>`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('click', () => {
    if (pendingAudioPlays.length === 0) return;
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();
    while (pendingAudioPlays.length > 0) { pendingAudioPlays.shift().play().catch(() => {}); }
});
