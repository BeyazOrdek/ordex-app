import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbPath = path.join(process.cwd(), 'database.json');

let dbData = { 
  users: [], 
  friends: [], 
  friend_requests: [],
  blocked_users: [],
  private_messages: [],
  groups: [],
  group_members: [],
  group_messages: [],
  guilds: [],
  guild_members: [],
  guild_channels: [],
  guild_messages: []
};

async function loadDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    dbData = JSON.parse(data);
    if (!Array.isArray(dbData.users)) dbData.users = [];
    if (!Array.isArray(dbData.friends)) dbData.friends = [];
    if (!Array.isArray(dbData.friend_requests)) dbData.friend_requests = [];
    if (!Array.isArray(dbData.blocked_users)) dbData.blocked_users = [];
    if (!Array.isArray(dbData.private_messages)) dbData.private_messages = [];
    if (!Array.isArray(dbData.groups)) dbData.groups = [];
    if (!Array.isArray(dbData.group_members)) dbData.group_members = [];
    if (!Array.isArray(dbData.group_messages)) dbData.group_messages = [];
    if (!Array.isArray(dbData.guilds)) dbData.guilds = [];
    if (!Array.isArray(dbData.guild_members)) dbData.guild_members = [];
    if (!Array.isArray(dbData.guild_channels)) dbData.guild_channels = [];
    if (!Array.isArray(dbData.guild_messages)) dbData.guild_messages = [];

    // Veritabanı Temizliği ve Mükerrer/Yetim Kayıt Onarımı
    const validUsernames = new Set(dbData.users.map(u => u.username));
    
    // 1. Mükerrer ve yetim arkadaşlıkları temizle
    const cleanFriends = [];
    const friendPairs = new Set();
    for (const f of dbData.friends) {
      if (f && f.user1 && f.user2 && validUsernames.has(f.user1) && validUsernames.has(f.user2) && f.user1 !== f.user2) {
        const pairKey = [f.user1, f.user2].sort().join(':::');
        if (!friendPairs.has(pairKey)) {
          friendPairs.add(pairKey);
          cleanFriends.push({ user1: f.user1, user2: f.user2, created_at: f.created_at || new Date().toISOString() });
        }
      }
    }
    dbData.friends = cleanFriends;

    // 2. Yetim arkadaşlık isteklerini temizle
    dbData.friend_requests = dbData.friend_requests.filter(req => 
      req && req.sender && req.receiver && validUsernames.has(req.sender) && validUsernames.has(req.receiver) && req.sender !== req.receiver
    );

    // 3. Yetim DM mesajlarını temizle
    dbData.private_messages = dbData.private_messages.filter(msg =>
      msg && msg.sender && msg.receiver && validUsernames.has(msg.sender) && validUsernames.has(msg.receiver)
    );

    await saveDb();
  } catch (err) {
    await saveDb();
  }
}

async function saveDb() {
  await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));
}

loadDb().catch(console.error);

let active_rooms = {};
let user_sessions = {};
let online_users = {};

// API Endpoints & Ordex Desktop Direct Download (GitHub Releases)
const GITHUB_RELEASE_URL = 'https://github.com/BeyazOrdek/ordex-app/releases/download/v1.0.0/Ordex.Setup.1.0.0.exe';

app.get('/download-desktop', (req, res) => {
  res.redirect(GITHUB_RELEASE_URL);
});

app.get(['/downloads/Ordex%20Setup.exe', '/downloads/Ordex Setup.exe', '/Downloads/Ordex%20Setup.exe', '/Downloads/Ordex Setup.exe'], (req, res) => {
  res.redirect(GITHUB_RELEASE_URL);
});

app.post('/api/register', async (req, res) => {
  const { username, password, display_name, avatar, about, avatar_frame, profile_banner, badges } = req.body;
  if (!username || !password) return res.json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur!' });

  const cleanUsername = username.trim();
  const exists = dbData.users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (exists) {
    return res.json({ success: false, message: 'Kullanıcı adı zaten alınmış!' });
  }

  const is_admin = cleanUsername === 'admin' ? 1 : 0;
  
  dbData.users.push({
    id: Date.now(),
    username: cleanUsername,
    password,
    display_name: display_name ? display_name.trim() : cleanUsername,
    avatar: avatar || '🎮',
    about: about || 'Siberpunk platform sakini.',
    avatar_frame: avatar_frame || 'none',
    profile_banner: profile_banner || 'linear-gradient(135deg, #00f0ff, #8a2be2)',
    badges: badges || '🎮',
    is_admin
  });
  
  await saveDb();
  res.json({ success: true });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const cleanUsername = username ? username.trim() : '';
  const user = dbData.users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (user && user.password === password) {
    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, user: userWithoutPass });
  } else {
    res.json({ success: false, message: 'Hatalı kullanıcı adı veya şifre!' });
  }
});

app.get('/api/profile/get', (req, res) => {
  const username = req.query.username;
  const user = dbData.users.find(u => u.username === username);
  if (user) {
    const { password: _, ...userWithoutPass } = user;
    res.json({ success: true, profile: userWithoutPass });
  } else {
    res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
});

app.post('/api/profile/update', async (req, res) => {
  const { username, display_name, avatar, about, avatar_frame, profile_banner, custom_status } = req.body;
  
  if (!username) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });
  
  const userIndex = dbData.users.findIndex(u => u.username === username);
  if (userIndex !== -1) {
    dbData.users[userIndex] = {
      ...dbData.users[userIndex],
      display_name: display_name ? display_name.trim() : dbData.users[userIndex].display_name,
      avatar,
      about,
      avatar_frame,
      profile_banner,
      custom_status
    };
    await saveDb();

    if (online_users[username]) {
      online_users[username].display_name = dbData.users[userIndex].display_name;
      online_users[username].avatar = avatar;
      online_users[username].frame = avatar_frame;
      online_users[username].banner = profile_banner;
      online_users[username].custom_status = custom_status;
    }
    
    io.emit('user_profile_updated', {
      username, display_name: dbData.users[userIndex].display_name, avatar, about, avatar_frame, profile_banner, custom_status,
      badges: dbData.users[userIndex].badges,
      is_admin: dbData.users[userIndex].is_admin
    });
    
    res.json({ success: true, message: 'Profil güncellendi!' });
  } else {
    res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
});

app.post('/api/admin/assign_badge', async (req, res) => {
  const { admin_user, target_user, badges } = req.body;
  
  const adminCheck = dbData.users.find(u => u.username === admin_user);
  if (!adminCheck || adminCheck.is_admin !== 1) {
    return res.json({ success: false, message: 'Rozet atamak için ADMİN yetkisi gereklidir!' });
  }
  
  const userIndex = dbData.users.findIndex(u => u.username === target_user);
  if (userIndex !== -1) {
    dbData.users[userIndex].badges = badges;
    await saveDb();
    
    if (online_users[target_user]) {
      online_users[target_user].badges = badges;
    }
    
    io.emit('user_profile_updated', { username: target_user, badges });
    res.json({ success: true, message: `'${target_user}' kullanıcısına rozetler başarıyla atandı!` });
  } else {
    res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
});

// ================= ARKADAŞLIK & KULLANICI ARAMA APILERI =================

// Kullanıcı Arama (Kısmi kullanıcı adı / Görünen ad)
app.get('/api/users/search', (req, res) => {
  const { q, username } = req.query;
  if (!q || !q.trim()) return res.json({ success: true, results: [] });

  const queryLower = q.trim().toLowerCase();
  const results = dbData.users
    .filter(u => u.username !== username && (u.username.toLowerCase().includes(queryLower) || (u.display_name && u.display_name.toLowerCase().includes(queryLower))))
    .slice(0, 15)
    .map(u => {
      const isFriend = dbData.friends.some(f => (f.user1 === username && f.user2 === u.username) || (f.user1 === u.username && f.user2 === username));
      const pendingReq = dbData.friend_requests.find(r => r.status === 'pending' && ((r.sender === username && r.receiver === u.username) || (r.sender === u.username && r.receiver === username)));
      const isOnline = !!online_users[u.username] && online_users[u.username].status !== 'invisible';

      return {
        username: u.username,
        displayName: u.display_name || u.username,
        avatar: u.avatar || '🎮',
        avatarFrame: u.avatar_frame || 'none',
        about: u.about || '',
        isFriend,
        hasPendingReq: !!pendingReq,
        pendingSender: pendingReq ? pendingReq.sender : null,
        isOnline
      };
    });

  res.json({ success: true, results });
});

// Arkadaşlık İsteği Gönderme
app.post('/api/friends/request', async (req, res) => {
  const { username, friendName } = req.body;
  if (!username || !friendName) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });
  const cleanFriendName = friendName.trim();
  if (username.toLowerCase() === cleanFriendName.toLowerCase()) return res.json({ success: false, message: 'Kendinize arkadaşlık isteği gönderemezsiniz!' });

  const senderUser = dbData.users.find(u => u.username === username);
  const targetUser = dbData.users.find(u => u.username.toLowerCase() === cleanFriendName.toLowerCase());
  if (!senderUser || !targetUser) return res.json({ success: false, message: 'Bu isimde bir kullanıcı bulunamadı!' });

  const realTargetName = targetUser.username;

  // Engelleme kontrolü
  const isBlocked = dbData.blocked_users.some(b => 
    (b.blocker === username && b.blocked === realTargetName) || 
    (b.blocker === realTargetName && b.blocked === username)
  );
  if (isBlocked) return res.json({ success: false, message: 'Bu kullanıcıyla arkadaşlık işlemi yapılamaz.' });

  // Zaten arkadaşlar mı?
  const alreadyFriends = dbData.friends.some(f => 
    (f.user1 === username && f.user2 === realTargetName) || 
    (f.user1 === realTargetName && f.user2 === username)
  );
  if (alreadyFriends) return res.json({ success: false, message: 'Bu kullanıcı zaten arkadaşınız!' });

  // Bekleyen istek var mı?
  const existingReq = dbData.friend_requests.find(r => 
    (r.sender === username && r.receiver === realTargetName && r.status === 'pending') ||
    (r.sender === realTargetName && r.receiver === username && r.status === 'pending')
  );

  if (existingReq) {
    if (existingReq.sender === realTargetName) {
      existingReq.status = 'accepted';
      dbData.friends.push({ user1: username, user2: realTargetName, created_at: new Date().toISOString() });
      await saveDb();

      if (online_users[realTargetName]) io.to(online_users[realTargetName].sid).emit('friends_updated');
      if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');

      return res.json({ success: true, message: `${realTargetName} de size istek göndermişti, otomatik arkadaş olundu!` });
    }
    return res.json({ success: false, message: 'Bekleyen bir arkadaşlık isteği zaten var!' });
  }

  // Yeni İstek Oluştur
  const reqId = 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  dbData.friend_requests.push({
    id: reqId,
    sender: username,
    receiver: realTargetName,
    status: 'pending',
    created_at: new Date().toISOString()
  });

  await saveDb();

  if (online_users[realTargetName]) {
    io.to(online_users[realTargetName].sid).emit('friend_request_received', {
      id: reqId,
      sender: username,
      displayName: senderUser.display_name,
      avatar: senderUser.avatar
    });
    io.to(online_users[realTargetName].sid).emit('friends_updated');
  }
  if (online_users[username]) {
    io.to(online_users[username].sid).emit('friends_updated');
  }

  res.json({ success: true, message: `'${targetUser.display_name}' kullanıcısına arkadaşlık isteği gönderildi!` });
});

// Gelen & Giden Arkadaşlık İstekleri Listesi
app.get('/api/friends/requests', (req, res) => {
  const username = req.query.username;
  if (!username) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });

  const pendingReceived = dbData.friend_requests
    .filter(r => r.receiver === username && r.status === 'pending')
    .map(r => {
      const u = dbData.users.find(user => user.username === r.sender);
      return {
        id: r.id,
        username: r.sender,
        displayName: u ? u.display_name : r.sender,
        avatar: u ? u.avatar : '🎮',
        avatarFrame: u ? u.avatar_frame : 'none',
        badges: u ? u.badges : '🎮',
        created_at: r.created_at
      };
    });

  const pendingSent = dbData.friend_requests
    .filter(r => r.sender === username && r.status === 'pending')
    .map(r => {
      const u = dbData.users.find(user => user.username === r.receiver);
      return {
        id: r.id,
        username: r.receiver,
        displayName: u ? u.display_name : r.receiver,
        avatar: u ? u.avatar : '🎮',
        avatarFrame: u ? u.avatar_frame : 'none',
        badges: u ? u.badges : '🎮',
        created_at: r.created_at
      };
    });

  res.json({ success: true, received: pendingReceived, sent: pendingSent });
});

// Arkadaşlık İsteğini Kabul Etme
app.post('/api/friends/accept', async (req, res) => {
  const { username, requestId, friendName } = req.body;
  if (!username) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });

  let requestIndex = -1;
  if (requestId) {
    requestIndex = dbData.friend_requests.findIndex(r => r.id === requestId && r.receiver === username && r.status === 'pending');
  } else if (friendName) {
    requestIndex = dbData.friend_requests.findIndex(r => r.sender === friendName && r.receiver === username && r.status === 'pending');
  }

  if (requestIndex === -1) return res.json({ success: false, message: 'Arkadaşlık isteği bulunamadı!' });

  const reqObj = dbData.friend_requests[requestIndex];
  dbData.friend_requests.splice(requestIndex, 1);

  const alreadyFriends = dbData.friends.some(f =>
    (f.user1 === reqObj.sender && f.user2 === reqObj.receiver) ||
    (f.user1 === reqObj.receiver && f.user2 === reqObj.sender)
  );

  if (!alreadyFriends) {
    dbData.friends.push({ user1: reqObj.sender, user2: reqObj.receiver, created_at: new Date().toISOString() });
  }
  await saveDb();

  if (online_users[reqObj.sender]) io.to(online_users[reqObj.sender].sid).emit('friends_updated');
  if (online_users[reqObj.receiver]) io.to(online_users[reqObj.receiver].sid).emit('friends_updated');

  res.json({ success: true, message: 'Arkadaşlık isteği kabul edildi!' });
});

// Arkadaşlık İsteğini Reddetme / İptal Etme
app.post('/api/friends/reject', async (req, res) => {
  const { username, requestId, friendName } = req.body;
  if (!username) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });

  const initialLen = dbData.friend_requests.length;
  let targetUser = friendName;

  dbData.friend_requests = dbData.friend_requests.filter(r => {
    if (requestId && r.id === requestId) {
      targetUser = r.sender === username ? r.receiver : r.sender;
      return false;
    }
    if (friendName && ((r.sender === username && r.receiver === friendName) || (r.sender === friendName && r.receiver === username))) {
      return false;
    }
    return true;
  });

  if (dbData.friend_requests.length !== initialLen) {
    await saveDb();
    if (targetUser && online_users[targetUser]) io.to(online_users[targetUser].sid).emit('friends_updated');
    if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');
  }

  res.json({ success: true, message: 'İstek kaldırıldı.' });
});

// Arkadaşlıktan Çıkarma
app.post('/api/friends/remove', async (req, res) => {
  const { username, friendName } = req.body;
  if (!username || !friendName) return res.json({ success: false, message: 'Geçersiz işlem!' });

  const initialLen = dbData.friends.length;
  dbData.friends = dbData.friends.filter(f => 
    !((f.user1 === username && f.user2 === friendName) || (f.user1 === friendName && f.user2 === username))
  );

  if (dbData.friends.length !== initialLen) {
    await saveDb();
    if (online_users[friendName]) io.to(online_users[friendName].sid).emit('friends_updated');
    if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');
  }

  res.json({ success: true, message: 'Arkadaşlıktan çıkarıldı.' });
});

// Geriye Dönük Uyumluluk için /api/friends/add
app.post('/api/friends/add', async (req, res) => {
  const { username, friendName } = req.body;
  if (!username || !friendName) return res.json({ success: false, message: 'Kullanıcı adı gerekli!' });
  const senderUser = dbData.users.find(u => u.username === username);
  const targetUser = dbData.users.find(u => u.username.toLowerCase() === friendName.trim().toLowerCase());
  if (!targetUser) return res.json({ success: false, message: 'Kullanıcı bulunamadı!' });

  const realTarget = targetUser.username;
  if (username === realTarget) return res.json({ success: false, message: 'Kendinizi ekleyemezsiniz!' });

  const alreadyFriends = dbData.friends.some(f => (f.user1 === username && f.user2 === realTarget) || (f.user1 === realTarget && f.user2 === username));
  if (alreadyFriends) return res.json({ success: false, message: 'Bu kullanıcı zaten arkadaşınız!' });

  dbData.friends.push({ user1: username, user2: realTarget, created_at: new Date().toISOString() });
  await saveDb();

  if (online_users[realTarget]) io.to(online_users[realTarget].sid).emit('friends_updated');
  if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');

  res.json({ success: true, message: 'Arkadaş eklendi!' });
});

app.get('/api/friends/list', (req, res) => {
  const username = req.query.username;
  if (!username) return res.json({ success: false, friends: [] });

  const friendRels = dbData.friends.filter(f => f.user1 === username || f.user2 === username);
  
  const friends = [];
  for (const r of friendRels) {
    const f_username = r.user1 === username ? r.user2 : r.user1;
    const f_data = dbData.users.find(u => u.username === f_username);
    
    if (f_data) {
      const msgs = dbData.private_messages.filter(m => 
        (m.sender === username && m.receiver === f_username) || 
        (m.sender === f_username && m.receiver === username)
      );
      const last_msg = msgs.length > 0 ? msgs[msgs.length - 1] : null;

      friends.push({
        username: f_username,
        displayName: f_data.display_name || f_username,
        avatar: f_data.avatar || '🎮',
        about: f_data.about || '',
        avatarFrame: f_data.avatar_frame || 'none',
        profileBanner: f_data.profile_banner || '',
        customStatus: online_users[f_username] && online_users[f_username].custom_status !== undefined ? online_users[f_username].custom_status : f_data.custom_status,
        userStatus: online_users[f_username] ? (online_users[f_username].status || 'online') : 'offline',
        badges: f_data.badges || '🎮',
        isAdmin: f_data.is_admin || 0,
        lastMessageTime: last_msg ? last_msg.timestamp : '1970-01-01T00:00:00Z',
        isOnline: !!online_users[f_username] && online_users[f_username].status !== 'invisible'
      });
    }
  }
  
  friends.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  res.json({ success: true, friends });
});

app.post('/api/groups/create', async (req, res) => {
  const { leader, name, avatar, members } = req.body;
  
  if (!leader || !name) return res.json({ success: false, message: 'Grup adı gerekli!' });
  
  if (!members.includes(leader)) members.push(leader);
  
  const group_id = Date.now();
  dbData.groups.push({
    id: group_id,
    name,
    leader,
    avatar: avatar || '👥',
    created_at: new Date().toISOString()
  });
  
  members.forEach(m => {
    dbData.group_members.push({ group_id, username: m });
  });
  
  await saveDb();
  
  members.forEach(m => {
    if (online_users[m]) io.to(online_users[m].sid).emit('groups_updated');
  });
  
  res.json({ success: true, group_id, message: 'Grup oluşturuldu!' });
});

app.get('/api/groups/list', (req, res) => {
  const username = req.query.username;
  const user_group_ids = dbData.group_members.filter(gm => gm.username === username).map(gm => gm.group_id);
  
  const groups = [];
  user_group_ids.forEach(gid => {
    const group = dbData.groups.find(g => g.id === gid);
    if (group) {
      const g_members = dbData.group_members.filter(gm => gm.group_id === gid);
      const members = g_members.map(gm => {
        const u = dbData.users.find(user => user.username === gm.username);
        const isOnline = !!online_users[gm.username] && online_users[gm.username].status !== 'invisible';
        const userStatus = online_users[gm.username] ? (online_users[gm.username].status || 'online') : 'offline';
        return {
          username: gm.username,
          displayName: u ? (u.display_name || u.username) : gm.username,
          avatar: u ? (u.avatar || '🎮') : '🎮',
          avatarFrame: u ? (u.avatar_frame || 'none') : 'none',
          customStatus: online_users[gm.username]?.custom_status || (u ? u.custom_status : ''),
          userStatus: isOnline ? userStatus : 'offline',
          badges: u ? (u.badges || '🎮') : '🎮',
          isAdmin: u ? (u.is_admin || 0) : 0,
          isOnline
        };
      });
      
      groups.push({
        id: group.id,
        name: group.name,
        leader: group.leader,
        avatar: group.avatar || '👥',
        members
      });
    }
  });
  
  res.json({ success: true, groups });
});

app.post('/api/groups/kick', async (req, res) => {
  const { group_id, leader, target_user } = req.body;
  const group = dbData.groups.find(g => g.id === group_id);
  
  if (!group || group.leader !== leader) {
    return res.json({ success: false, message: 'Sadece grup lideri üye atabilir!' });
  }
  
  dbData.group_members = dbData.group_members.filter(gm => !(gm.group_id === group_id && gm.username === target_user));
  await saveDb();
  
  if (online_users[target_user]) {
    io.to(online_users[target_user].sid).emit('kicked_from_group', { group_id });
    io.to(online_users[target_user].sid).emit('groups_updated');
  }
  
  res.json({ success: true, message: `${target_user} gruptan atıldı.` });
});

// ================= GUILD (SERVER) APIS =================

app.post('/api/guilds/create', async (req, res) => {
  const { name, owner, icon } = req.body;
  if (!name || !owner) return res.json({ success: false, message: 'İsim ve sahip gerekli.' });
  
  const id = 'guild_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const newGuild = { id, name, icon: icon || 'https://via.placeholder.com/100', owner, welcomeMessage: 'Sunucuya Hoş Geldiniz!', defaultTheme: 'theme-cyan' };
  dbData.guilds.push(newGuild);
  dbData.guild_members.push({ guildId: id, username: owner, role: 'owner' });
  
  // Default channels
  const generalChannel = { id: 'ch_' + Date.now() + '1', guildId: id, name: 'genel-sohbet', type: 'text' };
  const voiceChannel = { id: 'ch_' + Date.now() + '2', guildId: id, name: '🔊 Ses & Ekran', type: 'voice' };
  dbData.guild_channels.push(generalChannel, voiceChannel);
  
  await saveDb();
  res.json({ success: true, guild: newGuild });
});

app.get('/api/guilds/list', (req, res) => {
  const { username } = req.query;
  const userGuilds = dbData.guild_members.filter(gm => gm.username === username).map(gm => gm.guildId);
  const guilds = dbData.guilds.filter(g => userGuilds.includes(g.id)).map(g => {
    const role = dbData.guild_members.find(gm => gm.guildId === g.id && gm.username === username).role;
    const channels = dbData.guild_channels.filter(ch => ch.guildId === g.id);
    return { ...g, role, channels };
  });
  res.json({ success: true, guilds });
});

app.post('/api/guilds/join', async (req, res) => {
  const { guildId, username } = req.body;
  const guild = dbData.guilds.find(g => g.id === guildId);
  if (!guild) return res.json({ success: false, message: 'Sunucu bulunamadı.' });
  
  const exists = dbData.guild_members.find(gm => gm.guildId === guildId && gm.username === username);
  if (!exists) {
    dbData.guild_members.push({ guildId, username, role: 'member' });
    await saveDb();
  }
  res.json({ success: true, guild });
});

app.post('/api/guilds/channels/create', async (req, res) => {
  const { guildId, name, type, username } = req.body;
  const member = dbData.guild_members.find(gm => gm.guildId === guildId && gm.username === username);
  if (!member || member.role !== 'owner') {
    return res.json({ success: false, message: 'Yetkiniz yok.' });
  }
  const id = 'ch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  const newChannel = { id, guildId, name, type };
  dbData.guild_channels.push(newChannel);
  await saveDb();
  io.emit('guild_channel_created', newChannel);
  res.json({ success: true, channel: newChannel });
});

app.post('/api/guilds/settings', async (req, res) => {
  const { guildId, username, welcomeMessage, defaultTheme, icon } = req.body;
  const member = dbData.guild_members.find(gm => gm.guildId === guildId && gm.username === username);
  if (!member || member.role !== 'owner') return res.json({ success: false, message: 'Yetkiniz yok.' });
  
  const guildIndex = dbData.guilds.findIndex(g => g.id === guildId);
  if (guildIndex !== -1) {
    if (welcomeMessage !== undefined) dbData.guilds[guildIndex].welcomeMessage = welcomeMessage;
    if (defaultTheme !== undefined) dbData.guilds[guildIndex].defaultTheme = defaultTheme;
    if (icon !== undefined) dbData.guilds[guildIndex].icon = icon;
    await saveDb();
    io.emit('guild_settings_updated', dbData.guilds[guildIndex]);
    res.json({ success: true, guild: dbData.guilds[guildIndex] });
  } else {
    res.json({ success: false, message: 'Sunucu bulunamadı.' });
  }
});

app.get('/api/guilds/messages', (req, res) => {
  const { channelId } = req.query;
  const messages = dbData.guild_messages
    .filter(m => m.channelId === channelId)
    .map(m => ({ sender: m.sender, message: m.content, time: m.timestamp, display_name: m.display_name, avatar: m.avatar }));
  res.json({ success: true, messages });
});

app.get('/api/pm/history', (req, res) => {
  const { user1, user2, requester } = req.query;
  if (!user1 || !user2) return res.json({ success: false, history: [] });

  // Güvenlik Kontrolü: İstekte bulunan kullanıcı yalnızca kendisinin taraf olduğu sohbeti okuyabilir!
  if (requester && requester !== user1 && requester !== user2) {
    return res.status(403).json({ success: false, message: 'Bu sohbet geçmişini okuma yetkiniz yok!' });
  }

  const history = dbData.private_messages
    .filter(m => (m.sender === user1 && m.receiver === user2) || (m.sender === user2 && m.receiver === user1))
    .map(r => ({ sender: r.sender, receiver: r.receiver, message: r.message, time: r.timestamp, read: r.read }));
    
  res.json({ success: true, history });
});

app.get('/api/gifs', async (req, res) => {
  const query = req.query.q || 'trending';
  try {
    const tenorRes = await fetch(`https://tenor.com/search/${encodeURIComponent(query)}-gifs`);
    const html = await tenorRes.text();
    
    // Basit HTML kazıma
    const gifMatches = html.match(/src="(https:\/\/media\.tenor\.com\/[^"]+\.gif)"/g);
    let gifs = [];
    if (gifMatches) {
        gifs = [...new Set(gifMatches.map(m => m.replace('src="', '').replace('"', '')))].slice(0, 20);
    }
    
    res.json({ success: true, gifs });
  } catch (e) {
    res.status(500).json({ success: false, message: "Tenor hatası" });
  }
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('register_user', (data) => {
    const { username, display_name, avatar, avatar_frame, profile_banner, badges, is_admin, status, custom_status } = data;
    if (username) {
      const userInDb = dbData.users.find(u => u.username === username);
      const userStatus = status || (online_users[username]?.status) || 'online';
      const userCustomStatus = custom_status !== undefined ? custom_status : (userInDb?.custom_status || '');

      online_users[username] = {
        sid: socket.id,
        display_name: display_name || username,
        avatar: avatar || '🎮',
        frame: avatar_frame || 'none',
        banner: profile_banner || 'linear-gradient(135deg, #00f0ff, #8a2be2)',
        badges: badges || '🎮',
        is_admin: is_admin || 0,
        status: userStatus,
        custom_status: userCustomStatus
      };
      io.emit('user_status_change', {
        username,
        display_name: online_users[username].display_name,
        avatar: online_users[username].avatar,
        status: userStatus,
        custom_status: userCustomStatus,
        isOnline: userStatus !== 'invisible'
      });
    }
  });

  socket.on('change_status', (data) => {
    const { username, status, custom_status } = data;
    if (username && online_users[username]) {
      if (status) online_users[username].status = status;
      if (custom_status !== undefined) {
        online_users[username].custom_status = custom_status;
        const uIdx = dbData.users.findIndex(u => u.username === username);
        if (uIdx !== -1) {
          dbData.users[uIdx].custom_status = custom_status;
          saveDb();
        }
      }
      io.emit('user_status_change', {
        username,
        display_name: online_users[username].display_name,
        avatar: online_users[username].avatar,
        status: online_users[username].status,
        custom_status: online_users[username].custom_status,
        isOnline: online_users[username].status !== 'invisible'
      });
    }
  });

  
  socket.on('mark_read', (data) => {
    const { sender, receiver } = data;
    let updated = false;
    if (dbData.private_messages) {
      dbData.private_messages.forEach(msg => {
        if (msg.sender === sender && msg.receiver === receiver && !msg.read) {
          msg.read = true;
          updated = true;
        }
      });
      if (updated) {
        saveDb();
        if (online_users[sender]) {
          io.to(online_users[sender].sid).emit('messages_read', { by: receiver });
        }
      }
    }
  });

  
  socket.on('add_reaction', (data) => {
    // data: { type: 'dm'|'room', target, msgId, emoji, username }
    if (data.type === 'room') {
      io.to(data.target).emit('reaction_added', data);
    } else if (data.type === 'dm') {
      if (online_users[data.target]) {
        io.to(online_users[data.target].sid).emit('reaction_added', data);
      }
      io.to(socket.id).emit('reaction_added', data); // self
    }
  });

// ================= KULLANICI ENGELLEME APİLERİ =================
app.post('/api/users/block', async (req, res) => {
  const { username, targetUser } = req.body;
  if (!username || !targetUser || username === targetUser) return res.json({ success: false, message: 'Geçersiz işlem!' });

  const exists = dbData.blocked_users.some(b => b.blocker === username && b.blocked === targetUser);
  if (!exists) {
    dbData.blocked_users.push({ blocker: username, blocked: targetUser, created_at: new Date().toISOString() });
    
    // Arkadaşlıktan ve isteklerden çıkar
    dbData.friends = dbData.friends.filter(f => !((f.user1 === username && f.user2 === targetUser) || (f.user1 === targetUser && f.user2 === username)));
    dbData.friend_requests = dbData.friend_requests.filter(r => !((r.sender === username && r.receiver === targetUser) || (r.sender === targetUser && r.receiver === username)));

    await saveDb();

    if (online_users[targetUser]) io.to(online_users[targetUser].sid).emit('friends_updated');
    if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');
  }

  res.json({ success: true, message: `'${targetUser}' engellendi.` });
});

app.post('/api/users/unblock', async (req, res) => {
  const { username, targetUser } = req.body;
  if (!username || !targetUser) return res.json({ success: false, message: 'Geçersiz işlem!' });

  dbData.blocked_users = dbData.blocked_users.filter(b => !(b.blocker === username && b.blocked === targetUser));
  await saveDb();

  res.json({ success: true, message: `'${targetUser}' kullanıcısının engeli kaldırıldı.` });
});

app.get('/api/users/blocked', (req, res) => {
  const { username } = req.query;
  if (!username) return res.json({ success: false, blocked: [] });
  const blockedList = dbData.blocked_users
    .filter(b => b.blocker === username)
    .map(b => {
      const u = dbData.users.find(user => user.username === b.blocked);
      return {
        username: b.blocked,
        displayName: u ? u.display_name : b.blocked,
        avatar: u ? u.avatar : '🎮'
      };
    });
  res.json({ success: true, blocked: blockedList });
});

  socket.on('typing_start', (data) => {
    const { sender, receiver } = data;
    if (sender && receiver && online_users[receiver]) {
      io.to(online_users[receiver].sid).emit('user_typing_start', { sender });
    }
  });

  socket.on('typing_stop', (data) => {
    const { sender, receiver } = data;
    if (sender && receiver && online_users[receiver]) {
      io.to(online_users[receiver].sid).emit('user_typing_stop', { sender });
    }
  });

  socket.on('send_private_message', async (data) => {
    const { sender, receiver, message, replyTo } = data;
    if (!sender || !receiver || !message || typeof message !== 'string' || !message.trim()) {
      return socket.emit('error_message', { message: 'Boş veya geçersiz mesaj gönderilemez!' });
    }

    const cleanMsg = message.trim();

    // Alıcı var mı kontrol et
    const receiverUser = dbData.users.find(u => u.username === receiver);
    if (!receiverUser) {
      return socket.emit('error_message', { message: 'Mesaj gönderilecek kullanıcı bulunamadı!' });
    }

    // Engellenmiş mi kontrol et
    const isBlocked = dbData.blocked_users.some(b => 
      (b.blocker === sender && b.blocked === receiver) || 
      (b.blocker === receiver && b.blocked === sender)
    );
    if (isBlocked) {
      return socket.emit('error_message', { message: 'Bu kullanıcıya mesaj gönderemezsiniz.' });
    }

    const msgId = 'pm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newMsg = {
      id: msgId,
      sender,
      receiver,
      message: cleanMsg,
      timestamp: new Date().toISOString(),
      read: false,
      replyTo: replyTo || null,
      edited: false
    };

    dbData.private_messages.push(newMsg);
    await saveDb();
    
    const msg_data = { 
      id: msgId, 
      sender, 
      receiver, 
      message: cleanMsg, 
      time: newMsg.timestamp, 
      read: false,
      replyTo: newMsg.replyTo,
      edited: false
    };

    if (online_users[receiver]) {
      io.to(online_users[receiver].sid).emit('receive_private_message', msg_data);
    }
    io.to(socket.id).emit('receive_private_message', msg_data);
  });

  socket.on('edit_private_message', async (data) => {
    const { msgId, sender, newMessage } = data;
    if (!msgId || !sender || !newMessage || !newMessage.trim()) return;

    const msgObj = dbData.private_messages.find(m => m.id === msgId);
    if (!msgObj || msgObj.sender !== sender) {
      return socket.emit('error_message', { message: 'Bu mesajı düzenleme yetkiniz yok!' });
    }

    msgObj.message = newMessage.trim();
    msgObj.edited = true;
    await saveDb();

    const updatePayload = { msgId, newMessage: msgObj.message, receiver: msgObj.receiver, sender: msgObj.sender };
    if (online_users[msgObj.receiver]) io.to(online_users[msgObj.receiver].sid).emit('private_message_edited', updatePayload);
    if (online_users[msgObj.sender]) io.to(online_users[msgObj.sender].sid).emit('private_message_edited', updatePayload);
  });

  socket.on('delete_private_message', async (data) => {
    const { msgId, sender } = data;
    if (!msgId || !sender) return;

    const msgIdx = dbData.private_messages.findIndex(m => m.id === msgId);
    if (msgIdx === -1) return;
    const msgObj = dbData.private_messages[msgIdx];

    if (msgObj.sender !== sender) {
      return socket.emit('error_message', { message: 'Bu mesajı silme yetkiniz yok!' });
    }

    dbData.private_messages.splice(msgIdx, 1);
    await saveDb();

    const deletePayload = { msgId, receiver: msgObj.receiver, sender: msgObj.sender };
    if (online_users[msgObj.receiver]) io.to(online_users[msgObj.receiver].sid).emit('private_message_deleted', deletePayload);
    if (online_users[msgObj.sender]) io.to(online_users[msgObj.sender].sid).emit('private_message_deleted', deletePayload);
  });

  socket.on('send_guild_message', async (data) => {
    const { channelId, sender, message, guildId } = data;
    if (channelId && sender && message) {
      const user = dbData.users.find(u => u.username === sender);
      const msgObj = {
        id: Date.now(),
        channelId,
        sender,
        content: message,
        display_name: online_users[sender]?.display_name || user?.display_name || sender,
        avatar: online_users[sender]?.avatar || user?.avatar,
        timestamp: new Date().toISOString()
      };
      dbData.guild_messages.push(msgObj);
      await saveDb();
      
      // Herkese yayınla (Şimdilik global, sonrasında odaya özel olabilir)
      io.emit('receive_guild_message', msgObj);
    }
  });

  const handleDmCallRequest = (data) => {
    const receiver = data.receiver || data.target;
    if (receiver && online_users[receiver] && online_users[receiver].sid) {
      io.to(online_users[receiver].sid).emit('dm_call_request', data);
      io.to(online_users[receiver].sid).emit('dm-call-request', data);
    } else {
      io.to(socket.id).emit('dm_call_error', { message: `'${receiver || 'Kullanıcı'}' şu an çevrimdışı veya aramaya cevap veremiyor.` });
    }
  };
  socket.on('dm_call_request', handleDmCallRequest);
  socket.on('dm-call-user', handleDmCallRequest);
  socket.on('dm-call-request', handleDmCallRequest);

  const handleDmCallResponse = (data) => {
    const receiver = data.receiver || data.target;
    if (receiver && online_users[receiver] && online_users[receiver].sid) {
      io.to(online_users[receiver].sid).emit('dm_call_response', data);
      io.to(online_users[receiver].sid).emit('dm-call-response', data);
    }
  };
  socket.on('dm_call_response', handleDmCallResponse);
  socket.on('dm-call-accepted', (data) => handleDmCallResponse({ ...data, accepted: true }));
  socket.on('dm-call-rejected', (data) => handleDmCallResponse({ ...data, accepted: false }));

  const handleDmWebRtcOffer = (data) => {
    const target = data.target || data.receiver;
    if (target && online_users[target] && online_users[target].sid) {
      io.to(online_users[target].sid).emit('dm_webrtc_offer', data);
    }
  };
  socket.on('dm_webrtc_offer', handleDmWebRtcOffer);

  const handleDmWebRtcAnswer = (data) => {
    const target = data.target || data.receiver;
    if (target && online_users[target] && online_users[target].sid) {
      io.to(online_users[target].sid).emit('dm_webrtc_answer', data);
    }
  };
  socket.on('dm_webrtc_answer', handleDmWebRtcAnswer);

  const handleDmIceCandidate = (data) => {
    const target = data.target || data.receiver;
    if (target && online_users[target] && online_users[target].sid) {
      io.to(online_users[target].sid).emit('dm_webrtc_ice_candidate', data);
    }
  };
  socket.on('dm_webrtc_ice_candidate', handleDmIceCandidate);

  const handleDmCallEnd = (data) => {
    const target = data ? (data.target || data.receiver) : null;
    if (target && online_users[target] && online_users[target].sid) {
      io.to(online_users[target].sid).emit('dm_call_end', data);
      io.to(online_users[target].sid).emit('dm-call-ended', data);
    }
  };
  socket.on('dm_call_end', handleDmCallEnd);
  socket.on('dm-call-ended', handleDmCallEnd);

  socket.on('kick_room_user', (data) => {
    const target_sid = data.target_sid;
    if (user_sessions[socket.id]) {
      const room = user_sessions[socket.id].room;
      if (active_rooms[room] && active_rooms[room].host_sid === socket.id) {
        io.to(target_sid).emit('kicked_from_room', { room });
      }
    }
  });

  socket.on('get_rooms', () => {
    const lobby_data = {};
    for (let name in active_rooms) {
      lobby_data[name] = { count: active_rooms[name].count, type: active_rooms[name].type || 'watch' };
    }
    io.to(socket.id).emit('room_list', lobby_data);
  });

  socket.on('join_room', (data) => {
    let { username, room, room_type = 'watch', create_new = false, avatar = '🎮' } = data;
    if (username && room) {
      if (create_new && active_rooms[room]) {
        room = room + " #" + Math.floor(1000 + Math.random() * 9000);
      }
      
      socket.join(room);
      user_sessions[socket.id] = { room, username, muted: false, avatar };
      
      let is_host = false;
      if (!active_rooms[room]) {
        active_rooms[room] = {
          count: 0,
          host_sid: socket.id,
          host_username: username,
          queue: [],
          type: room_type
        };
        is_host = true;
      } else {
        if (active_rooms[room].host_username === username) {
          active_rooms[room].host_sid = socket.id;
          is_host = true;
        } else {
          is_host = false;
        }
      }
      
      active_rooms[room].count += 1;
      
      const users_in_this_room = [];
      for (let sid in user_sessions) {
        if (user_sessions[sid].room === room) {
          users_in_this_room.push({ sid, username: user_sessions[sid].username, muted: user_sessions[sid].muted, avatar: user_sessions[sid].avatar });
        }
      }
      
      io.to(room).emit('room_users_list', users_in_this_room);
      io.to(socket.id).emit('room_info', { is_host, type: active_rooms[room].type, roomName: room });
      io.to(socket.id).emit('update_queue', { queue: active_rooms[room].queue });
      socket.to(room).emit('user_joined', { username, sid: socket.id, muted: false, avatar });
      io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} odaya katıldı.`, type: 'system' });
      
      if (active_rooms[room].currentVideoUrl) {
        let curTime = active_rooms[room].mediaState ? active_rooms[room].mediaState.time : 0;
        let isPlaying = active_rooms[room].mediaState ? active_rooms[room].mediaState.isPlaying : false;
        if (isPlaying && active_rooms[room].mediaState.updatedAt) {
          curTime += (Date.now() - active_rooms[room].mediaState.updatedAt) / 1000;
        }
        io.to(socket.id).emit('sync_media_state', {
          videoUrl: active_rooms[room].currentVideoUrl,
          requested_by: active_rooms[room].currentRequestedBy,
          isPlaying,
          time: curTime
        });
      }

      const lobby_data = {};
      for (let name in active_rooms) {
        lobby_data[name] = { count: active_rooms[name].count, type: active_rooms[name].type || 'watch' };
      }
      io.emit('room_list', lobby_data);
    }
  });

  const handleLeaveRoom = () => {
    if (user_sessions[socket.id]) {
      const info = user_sessions[socket.id];
      const { room, username } = info;
      
      socket.leave(room);
      if (active_rooms[room]) {
        active_rooms[room].count -= 1;
        if (active_rooms[room].count <= 0) {
          delete active_rooms[room];
        } else if (active_rooms[room].host_sid === socket.id || active_rooms[room].host_username === username) {
          const remaining_sids = [];
          for (let s in user_sessions) {
            if (user_sessions[s].room === room && s !== socket.id) remaining_sids.push(s);
          }
          if (remaining_sids.length > 0) {
            const new_host_sid = remaining_sids[0];
            const new_host_username = user_sessions[new_host_sid].username;
            active_rooms[room].host_sid = new_host_sid;
            active_rooms[room].host_username = new_host_username;
            io.to(new_host_sid).emit('room_info', { is_host: true, type: active_rooms[room].type });
            io.to(room).emit('receive_message', { username: 'Sistem', message: `Oda sahibi ayrıldı. Yeni oda sorumlusu: ${new_host_username}`, type: 'system' });
          }
        }
      }
      
      io.to(room).emit('user_left', { sid: socket.id, username });
      io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} odadan ayrıldı.`, type: 'system' });
      
      delete user_sessions[socket.id];
      
      const lobby_data = {};
      for (let name in active_rooms) {
        lobby_data[name] = { count: active_rooms[name].count, type: active_rooms[name].type || 'watch' };
      }
      io.emit('room_list', lobby_data);
    }
  };

  socket.on('leave_room_event', handleLeaveRoom);

  socket.on('request_video', (data) => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      const url = data.videoUrl;
      if (active_rooms[room] && url) {
        active_rooms[room].queue.push({ url, requested_by: username });
        io.to(room).emit('update_queue', { queue: active_rooms[room].queue });
        io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} sıraya yeni bir video ekledi.`, type: 'system' });
      }
    }
  });

  socket.on('next_video', () => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      if (active_rooms[room]) {
        if (active_rooms[room].queue.length > 0) {
          const next_vid = active_rooms[room].queue.shift();
          active_rooms[room].currentVideoUrl = next_vid.url;
          active_rooms[room].currentRequestedBy = next_vid.requested_by;
          active_rooms[room].mediaState = { isPlaying: true, time: 0, updatedAt: Date.now() };
          io.to(room).emit('update_queue', { queue: active_rooms[room].queue });
          io.to(room).emit('load_video', { videoUrl: next_vid.url, requested_by: next_vid.requested_by });
          io.to(room).emit('receive_message', { username: 'Sistem', message: `Sıradaki videoya geçildi: ${next_vid.url}`, type: 'system' });
        }
      }
    }
  });

  socket.on('load_video', (data) => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      if (active_rooms[room]) {
        active_rooms[room].currentVideoUrl = data.videoUrl;
        active_rooms[room].currentRequestedBy = username;
        active_rooms[room].mediaState = { isPlaying: true, time: 0, updatedAt: Date.now() };
        io.to(room).emit('load_video', { videoUrl: data.videoUrl, requested_by: username });
      }
    }
  });

  socket.on('play_video', (data) => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      if (active_rooms[room]) {
        active_rooms[room].mediaState = {
          isPlaying: true,
          time: typeof data.time === 'number' ? data.time : 0,
          updatedAt: Date.now()
        };
        io.to(room).emit('play_video', { time: data.time || 0, sender: username });
      }
    }
  });

  socket.on('pause_video', (data) => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      if (active_rooms[room]) {
        active_rooms[room].mediaState = {
          isPlaying: false,
          time: typeof data.time === 'number' ? data.time : 0,
          updatedAt: Date.now()
        };
        io.to(room).emit('pause_video', { time: data.time || 0, sender: username });
      }
    }
  });

  socket.on('seek_video', (data) => {
    if (user_sessions[socket.id]) {
      const { room, username } = user_sessions[socket.id];
      if (active_rooms[room]) {
        const isPlaying = active_rooms[room].mediaState ? active_rooms[room].mediaState.isPlaying : false;
        active_rooms[room].mediaState = {
          isPlaying,
          time: typeof data.time === 'number' ? data.time : 0,
          updatedAt: Date.now()
        };
        io.to(room).emit('seek_video', { time: data.time || 0, sender: username });
      }
    }
  });

  socket.on('mute_status', (data) => {
    if (user_sessions[socket.id]) {
      const is_muted = data.muted !== undefined ? data.muted : true;
      user_sessions[socket.id].muted = is_muted;
      const room = user_sessions[socket.id].room;
      socket.to(room).emit('user_mute_status', { sid: socket.id, muted: is_muted });
    }
  });

  const performCleanup = () => {
    let disconnectedUser = null;
    for (let uname in online_users) {
      if (online_users[uname].sid === socket.id) {
        disconnectedUser = uname;
        delete online_users[uname];
        break;
      }
    }
    if (disconnectedUser) {
      io.emit('user_status_change', { username: disconnectedUser, isOnline: false, status: 'offline' });
    }
    handleLeaveRoom();
  };

  socket.on('disconnecting', () => {
      performCleanup();
  });
  
  socket.on('disconnect', () => {
      // already handled in disconnecting, but just in case, handleLeaveRoom is safe because it checks user_sessions
      performCleanup();
  });

  socket.on('webrtc_offer', (data) => {
    io.to(data.target_sid).emit('webrtc_offer', data);
  });
  socket.on('webrtc_answer', (data) => {
    io.to(data.target_sid).emit('webrtc_answer', data);
  });
  socket.on('webrtc_ice_candidate', (data) => {
    io.to(data.target_sid).emit('webrtc_ice_candidate', data);
  });

  socket.on('send_message', (data) => {
    if (data.room) {
      socket.to(data.room).emit('receive_message', {
        username: data.username,
        message: data.message,
        type: 'user'
      });
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
