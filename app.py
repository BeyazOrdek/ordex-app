import sqlite3
from flask import Flask, send_from_directory, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__, static_folder='public', static_url_path='')
app.config['SECRET_KEY'] = 'ordex_super_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, display_name TEXT, avatar TEXT, about TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS friends
                 (user1 TEXT, user2 TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS private_messages
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, receiver TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS groups
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, leader TEXT, avatar TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS group_members
                 (group_id INTEGER, username TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS group_messages
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER, sender TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')

    # Auto-migrations
    c.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in c.fetchall()]
    if 'display_name' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN display_name TEXT")
    if 'avatar' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN avatar TEXT")
    if 'about' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN about TEXT")
    if 'avatar_frame' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN avatar_frame TEXT")
    if 'profile_banner' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN profile_banner TEXT")
    if 'badges' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN badges TEXT")
    if 'is_admin' not in columns:
        c.execute("ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0")

    c.execute("PRAGMA table_info(groups)")
    g_columns = [col[1] for col in c.fetchall()]
    if 'avatar' not in g_columns:
        c.execute("ALTER TABLE groups ADD COLUMN avatar TEXT")
    
    c.execute("UPDATE users SET display_name = username WHERE display_name IS NULL OR display_name = ''")
    c.execute("UPDATE users SET avatar = '🎮' WHERE avatar IS NULL OR avatar = ''")
    c.execute("UPDATE users SET about = 'Siberpunk platform sakini.' WHERE about IS NULL OR about = ''")
    c.execute("UPDATE users SET avatar_frame = 'none' WHERE avatar_frame IS NULL OR avatar_frame = ''")
    c.execute("UPDATE users SET profile_banner = 'linear-gradient(135deg, #00f0ff, #8a2be2)' WHERE profile_banner IS NULL OR profile_banner = ''")
    c.execute("UPDATE users SET badges = '⚡,🎮' WHERE badges IS NULL OR badges = ''")
    c.execute("UPDATE users SET is_admin = 1 WHERE username = 'admin'")
    c.execute("UPDATE groups SET avatar = '👥' WHERE avatar IS NULL OR avatar = ''")
    
    conn.commit()
    conn.close()

init_db()

active_rooms = {}  
user_sessions = {}
online_users = {}  # {username: {'sid': sid, 'display_name': str, 'avatar': str, 'frame': str, 'banner': str, 'badges': str, 'is_admin': int}}

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    display_name = data.get('display_name', username)
    avatar = data.get('avatar', '🎮')
    about = data.get('about', 'Siberpunk platform sakini.')
    avatar_frame = data.get('avatar_frame', 'none')
    profile_banner = data.get('profile_banner', 'linear-gradient(135deg, #00f0ff, #8a2be2)')
    badges = data.get('badges', '🎮')
    is_admin = 1 if username == 'admin' else 0
    
    if not username or not password:
        return jsonify({"success": False, "message": "Kullanıcı adı ve şifre zorunludur!"})
        
    try:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("""INSERT INTO users (username, password, display_name, avatar, about, avatar_frame, profile_banner, badges, is_admin) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""", 
                  (username, password, display_name, avatar, about, avatar_frame, profile_banner, badges, is_admin))
        conn.commit()
        conn.close()
        return jsonify({"success": True})
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Kullanıcı adı zaten alınmış!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT id, username, display_name, avatar, about, avatar_frame, profile_banner, badges, is_admin, password FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()
    
    if row and row[9] == password:
        return jsonify({
            "success": True,
            "user": {
                "id": row[0],
                "username": row[1],
                "display_name": row[2] or row[1],
                "avatar": row[3] or '🎮',
                "about": row[4] or 'Siberpunk platform sakini.',
                "avatar_frame": row[5] or 'none',
                "profile_banner": row[6] or 'linear-gradient(135deg, #00f0ff, #8a2be2)',
                "badges": row[7] or '🎮',
                "is_admin": row[8] or 0
            }
        })
    return jsonify({"success": False, "message": "Hatalı kullanıcı adı veya şifre!"})

@app.route('/api/profile/get', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT username, display_name, avatar, about, avatar_frame, profile_banner, badges, is_admin FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()
    if row:
        return jsonify({
            "success": True,
            "profile": {
                "username": row[0],
                "display_name": row[1] or row[0],
                "avatar": row[2] or '🎮',
                "about": row[3] or 'Siberpunk platform sakini.',
                "avatar_frame": row[4] or 'none',
                "profile_banner": row[5] or 'linear-gradient(135deg, #00f0ff, #8a2be2)',
                "badges": row[6] or '🎮',
                "is_admin": row[7] or 0
            }
        })
    return jsonify({"success": False, "message": "Kullanıcı bulunamadı."})

@app.route('/api/profile/update', methods=['POST'])
def update_profile():
    data = request.json
    username = data.get('username')
    display_name = data.get('display_name')
    avatar = data.get('avatar')
    about = data.get('about', '')
    avatar_frame = data.get('avatar_frame', 'none')
    profile_banner = data.get('profile_banner', 'linear-gradient(135deg, #00f0ff, #8a2be2)')
    
    if not username:
        return jsonify({"success": False, "message": "Kullanıcı adı gerekli!"})
        
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("""UPDATE users SET display_name=?, avatar=?, about=?, avatar_frame=?, profile_banner=? WHERE username=?""", 
              (display_name, avatar, about, avatar_frame, profile_banner, username))
    conn.commit()
    
    c.execute("SELECT badges, is_admin FROM users WHERE username=?", (username,))
    user_info = c.fetchone()
    conn.close()
    
    badges = user_info[0] if user_info else '🎮'
    is_admin = user_info[1] if user_info else 0

    if username in online_users:
        online_users[username]['display_name'] = display_name
        online_users[username]['avatar'] = avatar
        online_users[username]['frame'] = avatar_frame
        online_users[username]['banner'] = profile_banner
        
    socketio.emit('user_profile_updated', {
        'username': username,
        'display_name': display_name,
        'avatar': avatar,
        'about': about,
        'avatar_frame': avatar_frame,
        'profile_banner': profile_banner,
        'badges': badges,
        'is_admin': is_admin
    })
    
    return jsonify({"success": True, "message": "Profil güncellendi!"})

# --- ADMİN ROZET YÖNETİMİ API'Sİ ---
@app.route('/api/admin/assign_badge', methods=['POST'])
def assign_badge():
    data = request.json
    admin_user = data.get('admin_user')
    target_user = data.get('target_user')
    badges = data.get('badges', '')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT is_admin FROM users WHERE username=?", (admin_user,))
    admin_check = c.fetchone()
    
    if not admin_check or admin_check[0] != 1:
        conn.close()
        return jsonify({"success": False, "message": "Rozet atamak için ADMİN yetkisi gereklidir!"})
        
    c.execute("UPDATE users SET badges=? WHERE username=?", (badges, target_user))
    conn.commit()
    conn.close()
    
    if target_user in online_users:
        online_users[target_user]['badges'] = badges
        
    socketio.emit('user_profile_updated', {'username': target_user, 'badges': badges})
    return jsonify({"success": True, "message": f"'{target_user}' kullanıcısına rozetler başarıyla atandı!"})

@app.route('/api/friends/add', methods=['POST'])
def add_friend():
    data = request.json
    username = data.get('username')
    friend_name = data.get('friendName')
    
    if username == friend_name:
        return jsonify({"success": False, "message": "Kendinizi ekleyemezsiniz!"})
        
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (friend_name,))
    if not c.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "Kullanıcı bulunamadı!"})
        
    c.execute("SELECT * FROM friends WHERE (user1=? AND user2=?) OR (user1=? AND user2=?)", 
              (username, friend_name, friend_name, username))
    if c.fetchone():
        conn.close()
        return jsonify({"success": False, "message": "Zaten arkadaşsınız!"})
        
    c.execute("INSERT INTO friends (user1, user2) VALUES (?, ?)", (username, friend_name))
    conn.commit()
    conn.close()
    
    if friend_name in online_users:
        socketio.emit('friends_updated', to=online_users[friend_name]['sid'])
    if username in online_users:
        socketio.emit('friends_updated', to=online_users[username]['sid'])
        
    return jsonify({"success": True, "message": "Arkadaş eklendi!"})

@app.route('/api/friends/list', methods=['GET'])
def get_friends():
    username = request.args.get('username')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT user1, user2 FROM friends WHERE user1=? OR user2=?", (username, username))
    rows = c.fetchall()
    
    friends = []
    for r in rows:
        f_username = r[1] if r[0] == username else r[0]
        c.execute("SELECT display_name, avatar, about, avatar_frame, profile_banner, badges, is_admin FROM users WHERE username=?", (f_username,))
        f_data = c.fetchone()
        disp_name = f_data[0] if (f_data and f_data[0]) else f_username
        avatar = f_data[1] if (f_data and f_data[1]) else '🎮'
        about = f_data[2] if (f_data and f_data[2]) else 'Siberpunk platform sakini.'
        frame = f_data[3] if (f_data and f_data[3]) else 'none'
        banner = f_data[4] if (f_data and f_data[4]) else 'linear-gradient(135deg, #00f0ff, #8a2be2)'
        badges = f_data[5] if (f_data and f_data[5]) else '🎮'
        is_admin = f_data[6] if (f_data and f_data[6]) else 0
        
        # Son Mesaj Zamanını Getir (Sıralama İçin)
        c.execute("""SELECT timestamp FROM private_messages 
                     WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?) 
                     ORDER BY id DESC LIMIT 1""", (username, f_username, f_username, username))
        last_msg = c.fetchone()
        last_time = last_msg[0] if last_msg else "1970-01-01 00:00:00"
        
        friends.append({
            'username': f_username,
            'displayName': disp_name,
            'avatar': avatar,
            'about': about,
            'avatarFrame': frame,
            'profileBanner': banner,
            'badges': badges,
            'isAdmin': is_admin,
            'lastMessageTime': last_time,
            'isOnline': f_username in online_users
        })
    conn.close()
    
    # DM Listesini Son Mesaja Göre En Üste Sırala!
    friends.sort(key=lambda x: x['lastMessageTime'], reverse=True)
    return jsonify({"success": True, "friends": friends})

@app.route('/api/groups/create', methods=['POST'])
def create_group():
    data = request.json
    leader = data.get('leader')
    group_name = data.get('name')
    group_avatar = data.get('avatar', '👥')
    members = data.get('members', [])
    
    if not leader or not group_name:
        return jsonify({"success": False, "message": "Grup adı gerekli!"})
        
    if leader not in members:
        members.append(leader)
        
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO groups (name, leader, avatar) VALUES (?, ?, ?)", (group_name, leader, group_avatar))
    group_id = c.lastrowid
    
    for m in members:
        c.execute("INSERT INTO group_members (group_id, username) VALUES (?, ?)", (group_id, m))
        
    conn.commit()
    conn.close()
    
    for m in members:
        if m in online_users:
            socketio.emit('groups_updated', to=online_users[m]['sid'])
            
    return jsonify({"success": True, "group_id": group_id, "message": "Grup oluşturuldu!"})

@app.route('/api/groups/list', methods=['GET'])
def list_groups():
    username = request.args.get('username')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''SELECT g.id, g.name, g.leader, g.avatar FROM groups g
                 JOIN group_members gm ON g.id = gm.group_id
                 WHERE gm.username=?''', (username,))
    rows = c.fetchall()
    
    groups = []
    for r in rows:
        gid, gname, gleader, gavatar = r[0], r[1], r[2], r[3] or '👥'
        c.execute('''SELECT gm.username, u.display_name, u.avatar, u.avatar_frame, u.badges, u.is_admin FROM group_members gm
                     LEFT JOIN users u ON gm.username = u.username
                     WHERE gm.group_id=?''', (gid,))
        m_rows = c.fetchall()
        members = [{
            'username': m[0],
            'displayName': m[1] or m[0],
            'avatar': m[2] or '🎮',
            'avatarFrame': m[3] or 'none',
            'badges': m[4] or '🎮',
            'isAdmin': m[5] or 0,
            'isOnline': m[0] in online_users
        } for m in m_rows]
        
        groups.append({
            'id': gid,
            'name': gname,
            'leader': gleader,
            'avatar': gavatar,
            'members': members
        })
    conn.close()
    return jsonify({"success": True, "groups": groups})

@app.route('/api/groups/kick', methods=['POST'])
def kick_group_member():
    data = request.json
    group_id = data.get('group_id')
    leader = data.get('leader')
    target_user = data.get('target_user')
    
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT leader FROM groups WHERE id=?", (group_id,))
    g_row = c.fetchone()
    
    if not g_row or g_row[0] != leader:
        conn.close()
        return jsonify({"success": False, "message": "Sadece grup lideri üye atabilir!"})
        
    c.execute("DELETE FROM group_members WHERE group_id=? AND username=?", (group_id, target_user))
    conn.commit()
    conn.close()
    
    if target_user in online_users:
        socketio.emit('kicked_from_group', {'group_id': group_id}, to=online_users[target_user]['sid'])
        socketio.emit('groups_updated', to=online_users[target_user]['sid'])
        
    return jsonify({"success": True, "message": f"{target_user} gruptan atıldı."})

@app.route('/api/pm/history', methods=['GET'])
def get_pm_history():
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''SELECT sender, receiver, message, timestamp FROM private_messages 
                 WHERE (sender=? AND receiver=?) OR (sender=? AND receiver=?)
                 ORDER BY id ASC''', (user1, user2, user2, user1))
    rows = c.fetchall()
    conn.close()
    
    history = [{'sender': r[0], 'receiver': r[1], 'message': r[2], 'time': r[3]} for r in rows]
    return jsonify({"success": True, "history": history})

# --- SOCKET EVENTS & SIGNALING ---
@socketio.on('register_user')
def handle_register_user(data):
    username = data.get('username')
    display_name = data.get('display_name', username)
    avatar = data.get('avatar', '🎮')
    frame = data.get('avatar_frame', 'none')
    banner = data.get('profile_banner', 'linear-gradient(135deg, #00f0ff, #8a2be2)')
    badges = data.get('badges', '🎮')
    is_admin = data.get('is_admin', 0)
    
    if username:
        online_users[username] = {
            'sid': request.sid,
            'display_name': display_name,
            'avatar': avatar,
            'frame': frame,
            'banner': banner,
            'badges': badges,
            'is_admin': is_admin
        }
        socketio.emit('user_status_change', {
            'username': username,
            'display_name': display_name,
            'avatar': avatar,
            'isOnline': True
        })

@socketio.on('send_private_message')
def handle_private_message(data):
    sender = data.get('sender')
    receiver = data.get('receiver')
    message = data.get('message')
    
    if sender and receiver and message:
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute("INSERT INTO private_messages (sender, receiver, message) VALUES (?, ?, ?)", (sender, receiver, message))
        conn.commit()
        conn.close()
        
        msg_data = {'sender': sender, 'receiver': receiver, 'message': message}
        
        if receiver in online_users:
            emit('receive_private_message', msg_data, to=online_users[receiver]['sid'])
        emit('receive_private_message', msg_data, to=request.sid)

@socketio.on('dm_call_request')
def handle_dm_call_request(data):
    receiver = data.get('receiver')
    if receiver in online_users and online_users[receiver]['sid']:
        emit('dm_call_request', data, to=online_users[receiver]['sid'])
    else:
        emit('dm_call_error', {
            'message': f"'{receiver}' şu an çevrimdışı veya aramaya cevap veremiyor."
        }, to=request.sid)

@socketio.on('dm_call_response')
def handle_dm_call_response(data):
    receiver = data.get('receiver')
    if receiver in online_users:
        emit('dm_call_response', data, to=online_users[receiver]['sid'])

@socketio.on('dm_webrtc_offer')
def handle_dm_webrtc_offer(data):
    target = data.get('target')
    if target in online_users:
        emit('dm_webrtc_offer', data, to=online_users[target]['sid'])

@socketio.on('dm_webrtc_answer')
def handle_dm_webrtc_answer(data):
    target = data.get('target')
    if target in online_users:
        emit('dm_webrtc_answer', data, to=online_users[target]['sid'])

@socketio.on('dm_webrtc_ice_candidate')
def handle_dm_webrtc_ice_candidate(data):
    target = data.get('target')
    if target in online_users:
        emit('dm_webrtc_ice_candidate', data, to=online_users[target]['sid'])

@socketio.on('dm_call_end')
def handle_dm_call_end(data):
    target = data.get('target')
    if target in online_users:
        emit('dm_call_end', data, to=online_users[target]['sid'])

@socketio.on('kick_room_user')
def handle_kick_room_user(data):
    target_sid = data.get('target_sid')
    if request.sid in user_sessions:
        room = user_sessions[request.sid]['room']
        if room in active_rooms and active_rooms[room]['host_sid'] == request.sid:
            emit('kicked_from_room', {'room': room}, to=target_sid)

@socketio.on('get_rooms')
def handle_get_rooms():
    lobby_data = {name: {'count': info['count'], 'type': info.get('type', 'watch')} for name, info in active_rooms.items()}
    emit('room_list', lobby_data)

@socketio.on('join_room')
def handle_join_room(data):
    username = data.get('username')
    room = data.get('room')
    room_type = data.get('room_type', 'watch')
    
    if username and room:
        join_room(room)
        user_sessions[request.sid] = {'room': room, 'username': username, 'muted': True}
        
        # 1. Eğer oda henüz açılmadıysa odayı oluştur
        if room not in active_rooms:
            active_rooms[room] = {
                'count': 0,
                'host_sid': request.sid,
                'host_username': username,  # Odayı kuran kişinin kullanıcı adı
                'queue': [],
                'type': room_type
            }
            is_host = True
        else:
            # 2. Oda zaten varsa: KULLANICI ADI kontrolü yap!
            # Eğer oda kurucusu geri geldiyse, yeni socket.id'sini güncelle ve host yap!
            if active_rooms[room].get('host_username') == username:
                active_rooms[room]['host_sid'] = request.sid
                is_host = True
            else:
                is_host = False
                
            room_type = active_rooms[room]['type']
            
        active_rooms[room]['count'] += 1
        
        users_in_this_room = [{'sid': sid, 'username': info['username'], 'muted': info.get('muted', True)} 
                              for sid, info in user_sessions.items() if info['room'] == room]
        
        emit('room_users_list', users_in_this_room, to=room)
        emit('room_info', {'is_host': is_host, 'type': room_type}, to=request.sid)
        emit('update_queue', {'queue': active_rooms[room]['queue']}, to=request.sid)
        emit('user_joined', {'username': username, 'sid': request.sid, 'muted': True}, to=room, include_self=False)
        emit('receive_message', {'username': 'Sistem', 'message': f"{username} odaya katıldı.", 'type': 'system'}, to=room)
        
        lobby_data = {name: {'count': info['count'], 'type': info.get('type', 'watch')} for name, info in active_rooms.items()}
        socketio.emit('room_list', lobby_data)
        
@socketio.on('leave_room_event')
def handle_leave_room_event(data):
    sid = request.sid
    if sid in user_sessions:
        info = user_sessions[sid]
        room = info['room']
        username = info['username']
        
        leave_room(room)
        if room in active_rooms:
            active_rooms[room]['count'] -= 1
            if active_rooms[room]['count'] <= 0:
                del active_rooms[room]
            elif active_rooms[room]['host_sid'] == sid or active_rooms[room].get('host_username') == username:
                remaining_sids = [s for s, u_info in user_sessions.items() if u_info['room'] == room and s != sid]
                if remaining_sids:
                    new_host_sid = remaining_sids[0]
                    new_host_username = user_sessions[new_host_sid]['username']
                    active_rooms[room]['host_sid'] = new_host_sid
                    active_rooms[room]['host_username'] = new_host_username
                    emit('room_info', {'is_host': True, 'type': active_rooms[room]['type']}, to=new_host_sid)
                    emit('receive_message', {'username': 'Sistem', 'message': f"Oda sahibi ayrıldı. Yeni oda sorumlusu: {new_host_username}", 'type': 'system'}, to=room)
        
        emit('user_left', {'sid': sid, 'username': username}, to=room)
        emit('receive_message', {'username': 'Sistem', 'message': f"{username} odadan ayrıldı.", 'type': 'system'}, to=room)
        
        del user_sessions[sid]
        
        lobby_data = {name: {'count': info['count'], 'type': info.get('type', 'watch')} for name, info in active_rooms.items()}
        socketio.emit('room_list', lobby_data)

@socketio.on('request_video')
def handle_request_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        url = data.get('videoUrl')
        if room in active_rooms and url:
            video_entry = {'url': url, 'requested_by': username}
            active_rooms[room]['queue'].append(video_entry)
            emit('update_queue', {'queue': active_rooms[room]['queue']}, to=room)
            emit('receive_message', {'username': 'Sistem', 'message': f"{username} sıraya yeni bir video ekledi.", 'type': 'system'}, to=room)

@socketio.on('next_video')
def handle_next_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        if room in active_rooms and active_rooms[room].get('host_username') == username:
            queue = active_rooms[room]['queue']
            if len(queue) > 0:
                next_vid = queue.pop(0)
                emit('update_queue', {'queue': queue}, to=room)
                emit('load_video', {'videoUrl': next_vid['url']}, to=room)
                emit('receive_message', {'username': 'Sistem', 'message': f"Oda sahibi sıradaki videoya geçti: {next_vid['url']}", 'type': 'system'}, to=room)

@socketio.on('load_video')
def handle_load_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        if room in active_rooms and active_rooms[room].get('host_username') == username:
            emit('load_video', {'videoUrl': data.get('videoUrl')}, to=room, include_self=False)

@socketio.on('play_video')
def handle_play_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        if room in active_rooms and active_rooms[room].get('host_username') == username:
            emit('play_video', {'time': data.get('time')}, to=room, include_self=False)

@socketio.on('pause_video')
def handle_pause_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        if room in active_rooms and active_rooms[room].get('host_username') == username:
            emit('pause_video', {'time': data.get('time')}, to=room, include_self=False)

@socketio.on('seek_video')
def handle_seek_video(data):
    sid = request.sid
    if sid in user_sessions:
        room = user_sessions[sid]['room']
        username = user_sessions[sid]['username']
        if room in active_rooms and active_rooms[room].get('host_username') == username:
            emit('seek_video', {'time': data.get('time')}, to=room, include_self=False)

@socketio.on('mute_status')
def handle_mute_status(data):
    if request.sid in user_sessions:
        is_muted = data.get('muted', True)
        user_sessions[request.sid]['muted'] = is_muted
        room = user_sessions[request.sid]['room']
        emit('user_mute_status', {'sid': request.sid, 'muted': is_muted}, to=room, include_self=False)

@socketio.on('disconnect')
def handle_disconnect():
    disconnected_user = None
    for uname, udata in list(online_users.items()):
        if udata['sid'] == request.sid:
            disconnected_user = uname
            del online_users[uname]
            break
            
    if disconnected_user:
        socketio.emit('user_status_change', {'username': disconnected_user, 'isOnline': False})

    if request.sid in user_sessions:
        handle_leave_room_event({})

@socketio.on('webrtc_offer')
def handle_offer(data):
    emit('webrtc_offer', data, to=data['target_sid'])

@socketio.on('webrtc_answer')
def handle_answer(data):
    emit('webrtc_answer', data, to=data['target_sid'])

@socketio.on('webrtc_ice_candidate')
def handle_ice(data):
    emit('webrtc_ice_candidate', data, to=data['target_sid'])

@socketio.on('send_message')
def handle_send_message(data):
    if data.get('room'):
        emit('receive_message', {
            'username': data.get('username'),
            'message': data.get('message'),
            'type': 'user'
        }, to=data['room'], include_self=False)
import os

if __name__ == '__main__':
    # Render'ın verdiği portu al, eğer bulamazsa varsayılan 3000 yap
    port = int(os.environ.get('PORT', 3000))
    socketio.run(app, host='0.0.0.0', port=port, debug=False)
