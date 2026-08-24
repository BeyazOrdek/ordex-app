const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const reactionLogic = `
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
`;

code = code.replace("socket.on('send_private_message'", reactionLogic + "\n  socket.on('send_private_message'");
fs.writeFileSync('server.js', code);
console.log('Patched server emoji logic');
