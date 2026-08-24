const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const disconnectOld = `  socket.on('disconnect', () => {
    let disconnectedUser = null;
    for (let uname in online_users) {
      if (online_users[uname].sid === socket.id) {
        disconnectedUser = uname;
        delete online_users[uname];
        break;
      }
    }
    if (disconnectedUser) {
      io.emit('user_status_change', { username: disconnectedUser, isOnline: false });
    }
    handleLeaveRoom();
  });`;

const disconnectNew = `  const performCleanup = () => {
    let disconnectedUser = null;
    for (let uname in online_users) {
      if (online_users[uname].sid === socket.id) {
        disconnectedUser = uname;
        delete online_users[uname];
        break;
      }
    }
    if (disconnectedUser) {
      io.emit('user_status_change', { username: disconnectedUser, isOnline: false });
    }
    handleLeaveRoom();
  };

  socket.on('disconnecting', () => {
      performCleanup();
  });
  
  socket.on('disconnect', () => {
      // already handled in disconnecting, but just in case, handleLeaveRoom is safe because it checks user_sessions
      performCleanup();
  });`;

code = code.replace(disconnectOld, disconnectNew);
fs.writeFileSync('server.js', code);
console.log('Patched disconnect');
