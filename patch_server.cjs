const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const markReadLogic = `
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
`;

code = code.replace("socket.on('send_private_message'", markReadLogic + "\n  socket.on('send_private_message'");
fs.writeFileSync('server.js', code);
console.log('Patched server');
