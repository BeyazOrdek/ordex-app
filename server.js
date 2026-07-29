import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { 
        origin: '*',
        methods: ["GET", "POST"]
    }
  });;

  app.use(express.json());

  const dbPath = path.join(process.cwd(), 'database.json');
  let dbData = { 
    users: [], friends: [], private_messages: [], groups: [], group_members: [], 
    guilds: [], guild_members: [], guild_channels: [], guild_messages: [] 
  };

  async function loadDb() {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      dbData = { ...dbData, ...JSON.parse(data) };
    } catch (err) {
      await saveDb();
    }
  }

  async function saveDb() {
    try {
      await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2));
    } catch(err) {
      console.error("DB Save Error", err);
    }
  }

  await loadDb();

  let active_rooms = {};
  let user_sessions = {};
  let online_users = {};

  // -- API Routes --
  app.post('/api/register', async (req, res) => {
    const { username, password, display_name, avatar, about, avatar_frame, profile_banner, badges } = req.body;
    if (!username || !password) return res.json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur!' });

    const exists = dbData.users.find((u) => u.username === username);
    if (exists) return res.json({ success: false, message: 'Kullanıcı adı zaten alınmış!' });

    const is_admin = username === 'admin' ? 1 : 0;
    dbData.users.push({
      id: Date.now(), username, password,
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
    const user = dbData.users.find((u) => u.username === username);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPass } = user;
      res.json({ success: true, user: userWithoutPass });
    } else {
      res.json({ success: false, message: 'Hatalı kullanıcı adı veya şifre!' });
    }
  });

  app.get('/api/profile/get', (req, res) => {
    const username = req.query.username;
    const user = dbData.users.find((u) => u.username === username);
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
    
    const userIndex = dbData.users.findIndex((u) => u.username === username);
    if (userIndex !== -1) {
      dbData.users[userIndex] = {
        ...dbData.users[userIndex], display_name, avatar, about, avatar_frame, profile_banner, custom_status
      };
      await saveDb();
      if (online_users[username]) {
        online_users[username] = { ...online_users[username], display_name, avatar, frame: avatar_frame, banner: profile_banner, custom_status };
      }
      io.emit('user_profile_updated', {
        username, display_name, avatar, about, avatar_frame, profile_banner, custom_status,
        badges: dbData.users[userIndex].badges, is_admin: dbData.users[userIndex].is_admin
      });
      res.json({ success: true, message: 'Profil güncellendi!' });
    } else {
      res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }
  });

  app.post('/api/admin/assign_badge', async (req, res) => {
    const { admin_user, target_user, badges } = req.body;
    const adminCheck = dbData.users.find((u) => u.username === admin_user);
    if (!adminCheck || adminCheck.is_admin !== 1) return res.json({ success: false, message: 'Rozet atamak için ADMİN yetkisi gereklidir!' });
    
    const userIndex = dbData.users.findIndex((u) => u.username === target_user);
    if (userIndex !== -1) {
      dbData.users[userIndex].badges = badges;
      await saveDb();
      if (online_users[target_user]) online_users[target_user].badges = badges;
      io.emit('user_profile_updated', { username: target_user, badges });
      res.json({ success: true, message: `'${target_user}' kullanıcısına rozetler başarıyla atandı!` });
    } else {
      res.json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }
  });

  app.post('/api/friends/add', async (req, res) => {
    const { username, friendName } = req.body;
    if (username === friendName) return res.json({ success: false, message: 'Kendinizi ekleyemezsiniz!' });
    const friendExists = dbData.users.find((u) => u.username === friendName);
    if (!friendExists) return res.json({ success: false, message: 'Kullanıcı bulunamadı!' });

    const alreadyFriends = dbData.friends.find((f) => 
      (f.user1 === username && f.user2 === friendName) || (f.user1 === friendName && f.user2 === username)
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
    const friendRels = dbData.friends.filter((f) => f.user1 === username || f.user2 === username);
    
    const friends = [];
    for (const r of friendRels) {
      const f_username = r.user1 === username ? r.user2 : r.user1;
      const f_data = dbData.users.find((u) => u.username === f_username);
      if (f_data) {
        const msgs = dbData.private_messages.filter((m) => 
          (m.sender === username && m.receiver === f_username) || (m.sender === f_username && m.receiver === username)
        );
        const last_msg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
        friends.push({
          username: f_username,
          displayName: f_data.display_name,
          avatar: f_data.avatar,
          about: f_data.about,
          avatarFrame: f_data.avatar_frame,
          profileBanner: f_data.profile_banner,
          customStatus: online_users[f_username]?.custom_status || f_data.custom_status,
          badges: f_data.badges,
          isAdmin: f_data.is_admin,
          lastMessageTime: last_msg ? last_msg.timestamp : '1970-01-01T00:00:00Z',
          isOnline: !!online_users[f_username]
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
    dbData.groups.push({ id: group_id, name, leader, avatar: avatar || '👥', created_at: new Date().toISOString() });
    members.forEach((m) => dbData.group_members.push({ group_id, username: m }));
    await saveDb();
    
    members.forEach((m) => { if (online_users[m]) io.to(online_users[m].sid).emit('groups_updated'); });
    res.json({ success: true, group_id, message: 'Grup oluşturuldu!' });
  });

  app.get('/api/groups/list', (req, res) => {
    const username = req.query.username;
    const user_group_ids = dbData.group_members.filter((gm) => gm.username === username).map((gm) => gm.group_id);
    const groups = [];
    user_group_ids.forEach((gid) => {
      const group = dbData.groups.find((g) => g.id === gid);
      if (group) {
        const g_members = dbData.group_members.filter((gm) => gm.group_id === gid);
        const members = g_members.map((gm) => {
          const u = dbData.users.find((user) => user.username === gm.username);
          return {
            username: gm.username,
            displayName: u ? (u.display_name || u.username) : gm.username,
            avatar: u?.avatar || '🎮',
            avatarFrame: u?.avatar_frame || 'none',
            customStatus: online_users[gm.username]?.custom_status || u?.custom_status || '',
            badges: u?.badges || '🎮',
            isAdmin: u?.is_admin || 0,
            isOnline: !!online_users[gm.username]
          };
        });
        groups.push({ id: group.id, name: group.name, leader: group.leader, avatar: group.avatar || '👥', members });
      }
    });
    res.json({ success: true, groups });
  });

  app.post('/api/groups/kick', async (req, res) => {
    const { group_id, leader, target_user } = req.body;
    const group = dbData.groups.find((g) => g.id === group_id);
    if (!group || group.leader !== leader) return res.json({ success: false, message: 'Sadece grup lideri üye atabilir!' });
    
    dbData.group_members = dbData.group_members.filter((gm) => !(gm.group_id === group_id && gm.username === target_user));
    await saveDb();
    
    if (online_users[target_user]) {
      io.to(online_users[target_user].sid).emit('kicked_from_group', { group_id });
      io.to(online_users[target_user].sid).emit('groups_updated');
    }
    res.json({ success: true, message: `${target_user} gruptan atıldı.` });
  });

  app.get('/api/pm/history', (req, res) => {
    const { user1, user2 } = req.query;
    const history = dbData.private_messages
      .filter((m) => (m.sender === user1 && m.receiver === user2) || (m.sender === user2 && m.receiver === user1))
      .map((r) => ({ sender: r.sender, receiver: r.receiver, message: r.message, time: r.timestamp }));
    res.json({ success: true, history });
  });

  app.get('/api/gifs', async (req, res) => {
    const query = req.query.q || 'trending';
    try {
      const tenorRes = await fetch(`https://tenor.com/search/${encodeURIComponent(query)}-gifs`);
      const html = await tenorRes.text();
      const gifMatches = html.match(/src="(https:\/\/media\.tenor\.com\/[^"]+\.gif)"/g);
      let gifs = [];
      if (gifMatches) {
          gifs = [...new Set(gifMatches.map((m) => m.replace('src="', '').replace('"', '')))].slice(0, 20);
      }
      res.json({ success: true, gifs });
    } catch (e) {
      res.status(500).json({ success: false, message: "Tenor hatası" });
    }
  });

  // Socket.io Events
  io.on('connection', (socket) => {
    socket.on('register_user', (data) => {
      const { username, display_name, avatar, avatar_frame, profile_banner, badges, is_admin } = data;
      if (username) {
        online_users[username] = {
          sid: socket.id,
          display_name: display_name || username,
          avatar: avatar || '🎮',
          frame: avatar_frame || 'none',
          banner: profile_banner || 'linear-gradient(135deg, #00f0ff, #8a2be2)',
          badges: badges || '🎮',
          is_admin: is_admin || 0
        };
        io.emit('user_status_change', { username, display_name: online_users[username].display_name, avatar: online_users[username].avatar, isOnline: true });
      }
    });

    socket.on('send_private_message', async (data) => {
      const { sender, receiver, message } = data;
      if (sender && receiver && message) {
        dbData.private_messages.push({ id: Date.now(), sender, receiver, message, timestamp: new Date().toISOString() });
        await saveDb();
        const msg_data = { sender, receiver, message };
        if (online_users[receiver]) io.to(online_users[receiver].sid).emit('receive_private_message', msg_data);
        io.to(socket.id).emit('receive_private_message', msg_data);
      }
    });

    // Handle DM Calls
    socket.on('dm_call_request', (data) => {
      const receiver = data.receiver;
      if (online_users[receiver]?.sid) {
        io.to(online_users[receiver].sid).emit('dm_call_request', data);
      } else {
        io.to(socket.id).emit('dm_call_error', { message: `'${receiver}' şu an çevrimdışı veya aramaya cevap veremiyor.` });
      }
    });
    socket.on('dm_call_response', (data) => { if (online_users[data.receiver]) io.to(online_users[data.receiver].sid).emit('dm_call_response', data); });
    socket.on('dm_webrtc_offer', (data) => { if (online_users[data.target]) io.to(online_users[data.target].sid).emit('dm_webrtc_offer', data); });
    socket.on('dm_webrtc_answer', (data) => { if (online_users[data.target]) io.to(online_users[data.target].sid).emit('dm_webrtc_answer', data); });
    socket.on('dm_webrtc_ice_candidate', (data) => { if (online_users[data.target]) io.to(online_users[data.target].sid).emit('dm_webrtc_ice_candidate', data); });
    socket.on('dm_call_end', (data) => { if (online_users[data.target]) io.to(online_users[data.target].sid).emit('dm_call_end', data); });

    socket.on('kick_room_user', (data) => {
      const target_sid = data.target_sid;
      if (user_sessions[socket.id]) {
        const room = user_sessions[socket.id].room;
        if (active_rooms[room] && active_rooms[room].host_sid === socket.id) io.to(target_sid).emit('kicked_from_room', { room });
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
        if (create_new && active_rooms[room]) room = room + " #" + Math.floor(1000 + Math.random() * 9000);
        socket.join(room);
        user_sessions[socket.id] = { room, username, muted: true, avatar };
        
        let is_host = false;
        if (!active_rooms[room]) {
          active_rooms[room] = { count: 0, host_sid: socket.id, host_username: username, queue: [], type: room_type };
          is_host = true;
        } else {
          if (active_rooms[room].host_username === username) { active_rooms[room].host_sid = socket.id; is_host = true; }
        }
        
        active_rooms[room].count += 1;
        const users_in_this_room = [];
        for (let sid in user_sessions) {
          if (user_sessions[sid].room === room) users_in_this_room.push({ sid, username: user_sessions[sid].username, muted: user_sessions[sid].muted, avatar: user_sessions[sid].avatar });
        }
        
        io.to(room).emit('room_users_list', users_in_this_room);
        const room_state = active_rooms[room];
        io.to(socket.id).emit('room_info', { is_host, type: room_state.type, roomName: room });
        io.to(socket.id).emit('update_queue', { queue: room_state.queue });
        
        if (room_state.current_video) {
          io.to(socket.id).emit('load_video', { videoUrl: room_state.current_video });
          setTimeout(() => {
            let syncTime = room_state.current_time || 0;
            if (room_state.is_playing && room_state.last_update_time) {
                syncTime += (Date.now() - room_state.last_update_time) / 1000;
            }
            if (room_state.is_playing) {
              io.to(socket.id).emit('play_video', { time: syncTime });
            } else {
              io.to(socket.id).emit('pause_video', { time: syncTime });
            }
          }, 1500);
        }
        socket.to(room).emit('user_joined', { username, sid: socket.id, muted: true, avatar });
        io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} odaya katıldı.`, type: 'system' });
        
        const lobby_data = {};
        for (let name in active_rooms) lobby_data[name] = { count: active_rooms[name].count, type: active_rooms[name].type || 'watch' };
        io.emit('room_list', lobby_data);
      }
    });

    const handleLeaveRoom = () => {
      if (user_sessions[socket.id]) {
        const { room, username } = user_sessions[socket.id];
        socket.leave(room);
        if (active_rooms[room]) {
          active_rooms[room].count -= 1;
          if (active_rooms[room].count <= 0) {
            delete active_rooms[room];
          } else if (active_rooms[room].host_sid === socket.id || active_rooms[room].host_username === username) {
            const remaining_sids = [];
            for (let s in user_sessions) { if (user_sessions[s].room === room && s !== socket.id) remaining_sids.push(s); }
            if (remaining_sids.length > 0) {
              const new_host_sid = remaining_sids[0];
              active_rooms[room].host_sid = new_host_sid;
              active_rooms[room].host_username = user_sessions[new_host_sid].username;
              io.to(new_host_sid).emit('room_info', { is_host: true, type: active_rooms[room].type });
              io.to(room).emit('receive_message', { username: 'Sistem', message: `Oda sahibi ayrıldı. Yeni sorumlusu: ${user_sessions[new_host_sid].username}`, type: 'system' });
            }
          }
        }
        io.to(room).emit('user_left', { sid: socket.id, username });
        io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} odadan ayrıldı.`, type: 'system' });
        delete user_sessions[socket.id];
        const lobby_data = {};
        for (let name in active_rooms) lobby_data[name] = { count: active_rooms[name].count, type: active_rooms[name].type || 'watch' };
        io.emit('room_list', lobby_data);
      }
    };
    socket.on('leave_room_event', handleLeaveRoom);

    // Watch party events
    socket.on('request_video', (data) => {
      if (user_sessions[socket.id]) {
        const { room, username } = user_sessions[socket.id];
        if (active_rooms[room] && data.videoUrl) {
          active_rooms[room].queue.push({ url: data.videoUrl, requested_by: username });
          io.to(room).emit('update_queue', { queue: active_rooms[room].queue });
          io.to(room).emit('receive_message', { username: 'Sistem', message: `${username} sıraya yeni bir video ekledi.`, type: 'system' });
        }
      }
    });

    socket.on('next_video', () => {
      if (user_sessions[socket.id]) {
        const { room, username } = user_sessions[socket.id];
        if (active_rooms[room] && active_rooms[room].host_username === username && active_rooms[room].queue.length > 0) {
          const next_vid = active_rooms[room].queue.shift();
          io.to(room).emit('update_queue', { queue: active_rooms[room].queue });
          io.to(room).emit('load_video', { videoUrl: next_vid.url });
          io.to(room).emit('receive_message', { username: 'Sistem', message: `Oda sahibi sıradaki videoya geçti.`, type: 'system' });
        }
      }
    });

    socket.on('load_video', (data) => { 
      if (user_sessions[socket.id] && active_rooms[user_sessions[socket.id].room]?.host_username === user_sessions[socket.id].username) {
        const room = user_sessions[socket.id].room;
        active_rooms[room].current_video = data.videoUrl;
        active_rooms[room].is_playing = false;
        active_rooms[room].current_time = 0;
        active_rooms[room].last_update_time = Date.now();
        socket.to(room).emit('load_video', { videoUrl: data.videoUrl }); 
      }
    });
    socket.on('play_video', (data) => { 
      if (user_sessions[socket.id] && active_rooms[user_sessions[socket.id].room]?.host_username === user_sessions[socket.id].username) {
        const room = user_sessions[socket.id].room;
        active_rooms[room].is_playing = true;
        active_rooms[room].current_time = data.time;
        active_rooms[room].last_update_time = Date.now();
        socket.to(room).emit('play_video', { time: data.time }); 
      }
    });
    socket.on('pause_video', (data) => { 
      if (user_sessions[socket.id] && active_rooms[user_sessions[socket.id].room]?.host_username === user_sessions[socket.id].username) {
        const room = user_sessions[socket.id].room;
        active_rooms[room].is_playing = false;
        active_rooms[room].current_time = data.time;
        active_rooms[room].last_update_time = Date.now();
        socket.to(room).emit('pause_video', { time: data.time }); 
      }
    });
    socket.on('seek_video', (data) => { 
      if (user_sessions[socket.id] && active_rooms[user_sessions[socket.id].room]?.host_username === user_sessions[socket.id].username) {
        const room = user_sessions[socket.id].room;
        active_rooms[room].current_time = data.time;
        active_rooms[room].last_update_time = Date.now();
        socket.to(room).emit('seek_video', { time: data.time }); 
      }
    });
    socket.on('sync_video_time', (data) => {
      // Host calls this periodically to keep server time accurate
      if (user_sessions[socket.id] && active_rooms[user_sessions[socket.id].room]?.host_username === user_sessions[socket.id].username) {
        const room = user_sessions[socket.id].room;
        active_rooms[room].current_time = data.time;
        active_rooms[room].last_update_time = Date.now();
        if (data.is_playing !== undefined) active_rooms[room].is_playing = data.is_playing;
        
        socket.to(room).emit('sync_video_time', data);
      }
    });

    socket.on('mute_status', (data) => {
      if (user_sessions[socket.id]) {
        const is_muted = data.muted !== undefined ? data.muted : true;
        user_sessions[socket.id].muted = is_muted;
        socket.to(user_sessions[socket.id].room).emit('user_mute_status', { sid: socket.id, muted: is_muted });
      }
    });

    socket.on('disconnect', () => {
      let disconnectedUser = null;
      for (let uname in online_users) {
        if (online_users[uname].sid === socket.id) {
          disconnectedUser = uname;
          delete online_users[uname];
          break;
        }
      }
      if (disconnectedUser) io.emit('user_status_change', { username: disconnectedUser, isOnline: false });
      handleLeaveRoom();
    });

    socket.on('webrtc_offer', (data) => { io.to(data.target_sid).emit('webrtc_offer', data); });
    socket.on('webrtc_answer', (data) => { io.to(data.target_sid).emit('webrtc_answer', data); });
    socket.on('webrtc_ice_candidate', (data) => { io.to(data.target_sid).emit('webrtc_ice_candidate', data); });
    socket.on('send_message', (data) => { if (data.room) socket.to(data.room).emit('receive_message', { username: data.username, message: data.message, type: 'user' }); });
  });

// Vite ve Statik Dosya Middleware Ayarları
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Port ve Sunucuyu Başlatma
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
} // <-- async function startServer()'ın KAPATMA PARANTEZİ (Bunu kontrol et!)

startServer();
