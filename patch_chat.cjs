const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const oldChat = `function addMessageToChat(user, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ' + (type === 'my' ? 'my-message' : (type === 'system' ? 'system-message' : ''));
    if (type === 'system') msgDiv.innerHTML = \`<span class="msg-text">\${text}</span>\`;
    else msgDiv.innerHTML = \`<span class="msg-user">\${user}</span><span class="msg-text">\${text}</span>\`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}`;

const newChat = `function addMessageToChat(user, text, type, msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5)) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message chat-message ' + (type === 'my' ? 'my-message' : (type === 'system' ? 'system-message' : ''));
    msgDiv.id = 'chatmsg-' + msgId;
    msgDiv.style.position = 'relative';

    let contentHtml = text;
    if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif'))))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    if (type === 'system') {
        msgDiv.innerHTML = \`<span class="msg-text">\${contentHtml}</span>\`;
    } else {
        msgDiv.innerHTML = \`
            <span class="msg-user">\${user}</span><span class="msg-text">\${contentHtml}</span>
            <div class="msg-reactions" id="chatreactions-\${msgId}" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
            <div class="msg-reaction-btn chat-reaction-btn" onclick="showChatEmojiPicker('\${msgId}', '\${currentRoom}')" title="Tepki Ekle">😀</div>
        \`;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}`;

if (code.includes(oldChat)) {
    code = code.replace(oldChat, newChat);
    fs.writeFileSync('public/script.js', code);
    console.log("Chat patched");
} else {
    console.log("Could not find oldChat");
}
