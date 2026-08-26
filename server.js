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
    if (!dbData.guilds) dbData.guilds = [];
    if (!dbData.guild_members) dbData.guild_members = [];
    if (!dbData.guild_channels) dbData.guild_channels = [];
    if (!dbData.guild_messages) dbData.guild_messages = [];
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

  const exists = dbData.users.find(u => u.username === username);
  if (exists) {
    return res.json({ success: false, message: 'Kullanıcı adı zaten alınmış!' });
  }

  const is_admin = username === 'admin' ? 1 : 0;
  
  dbData.users.push({
    id: Date.now(),
    username,
    password,
    display_name: display_name || username,
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
  const user = dbData.users.find(u => u.username === username);
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
      display_name,
      avatar,
      about,
      avatar_frame,
      profile_banner,
      custom_status
    };
    await saveDb();

    if (online_users[username]) {
      online_users[username].display_name = display_name;
      online_users[username].avatar = avatar;
      online_users[username].frame = avatar_frame;
      online_users[username].banner = profile_banner;
      online_users[username].custom_status = custom_status;
    }
    
    io.emit('user_profile_updated', {
      username, display_name, avatar, about, avatar_frame, profile_banner, custom_status,
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

app.post('/api/friends/add', async (req, res) => {
  const { username, friendName } = req.body;
  
  if (username === friendName) return res.json({ success: false, message: 'Kendinizi ekleyemezsiniz!' });
  
  const friendExists = dbData.users.find(u => u.username === friendName);
  if (!friendExists) return res.json({ success: false, message: 'Kullanıcı bulunamadı!' });

  const alreadyFriends = dbData.friends.find(f => 
    (f.user1 === username && f.user2 === friendName) || 
    (f.user1 === friendName && f.user2 === username)
  );
  
  if (alreadyFriends) return res.json({ success: false, message: 'Zaten arkadaşsınız!' });

  dbData.friends.push({ user1: username, user2: friendName });
  await saveDb();
  
  if (online_users[friendName]) io.to(online_users[friendName].sid).emit('friends_updated');
  if (online_users[username]) io.to(online_users[username].sid).emit('friends_updated');
  
  res.json({ success: true, message: 'Arkadaş eklendi!' });
});

app.get('/api/friends/list', (req, res) => {
  const username = req.query.username;
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
        displayName: f_data.display_name,
        avatar: f_data.avatar,
        about: f_data.about,
        avatarFrame: f_data.avatar_frame,
        profileBanner: f_data.profile_banner,
        customStatus: online_users[f_username] && online_users[f_username].custom_status !== undefined ? online_users[f_username].custom_status : f_data.custom_status,
        userStatus: online_users[f_username] ? (online_users[f_username].status || 'online') : 'offline',
        badges: f_data.badges,
        isAdmin: f_data.is_admin,
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
  const { user1, user2 } = req.query;
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

  socket.on('send_private_message', async (data) => {
    const { sender, receiver, message } = data;
    if (sender && receiver && message) {
      dbData.private_messages.push({
        id: Date.now(),
        sender,
        receiver,
        message,
        timestamp: new Date().toISOString()
      });
      await saveDb();
      
      const msg_data = { sender, receiver, message };
      if (online_users[receiver]) {
        io.to(online_users[receiver].sid).emit('receive_private_message', msg_data);
      }
      io.to(socket.id).emit('receive_private_message', msg_data);
    }
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
      user_sessions[socket.id] = { room, username, muted: true, avatar };
      
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
      socket.to(room).emit('user_joined', { username, sid: socket.id, muted: true, avatar });
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
