const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// 1. Auto-rejoin room on connect
const connectOld = `        });
    }
});`;
const connectNew = `        });
        if (typeof currentRoom !== 'undefined' && currentRoom) {
            socket.emit('join_room', { 
                 username: myUsername, 
                 room: currentRoom, 
                 room_type: typeof currentRoomType !== 'undefined' ? currentRoomType : 'watch',
                 create_new: false,
                 avatar: myAvatar 
            });
            if (typeof localAudioStream !== 'undefined' && localAudioStream && localAudioStream.getAudioTracks().length > 0) {
                socket.emit('mute_status', { muted: !localAudioStream.getAudioTracks()[0].enabled });
            }
        }
    }
});`;
code = code.replace(connectOld, connectNew);

fs.writeFileSync('public/script.js', code);
console.log('Patched reconnect');
