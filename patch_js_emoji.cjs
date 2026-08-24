const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const appendPmOld = `function appendPmMessage(sender, text, isRead = false) {
    const isMy = sender === myUsername;
    const msgDiv = document.createElement('div');
    msgDiv.className = \`dm-message \${isMy ? 'my-pm' : 'other-pm'}\`;
    
    let contentHtml = text;
    if (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com')))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    const readIndicator = isMy ? \`<div class="read-receipt">\${isRead ? '✔️ Görüldü' : '✓ Gönderildi'}</div>\` : '';

    msgDiv.innerHTML = \`
        <div class="dm-sender">\${isMy ? myDisplayName : sender}</div>
        <div class="dm-text">\${contentHtml}</div>
        \${readIndicator}
    \`;
    pmMessagesContainer.appendChild(msgDiv);
    pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
}`;

const appendPmNew = `function appendPmMessage(sender, text, isRead = false, msgId = Date.now().toString()) {
    const isMy = sender === myUsername;
    const msgDiv = document.createElement('div');
    msgDiv.className = \`dm-message \${isMy ? 'my-pm' : 'other-pm'}\`;
    msgDiv.id = 'msg-' + msgId;
    msgDiv.style.position = 'relative';
    
    let contentHtml = text;
    if (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com')))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    const readIndicator = isMy ? \`<div class="read-receipt">\${isRead ? '✔️ Görüldü' : '✓ Gönderildi'}</div>\` : '';

    msgDiv.innerHTML = \`
        <div class="dm-sender">\${isMy ? myDisplayName : sender}</div>
        <div class="dm-text">\${contentHtml}</div>
        \${readIndicator}
        <div class="msg-reactions" id="reactions-\${msgId}" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
        <div class="msg-reaction-btn" onclick="showEmojiPicker('\${msgId}', '\${sender}')" title="Tepki Ekle">😀</div>
    \`;
    pmMessagesContainer.appendChild(msgDiv);
    pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
}`;

code = code.replace(appendPmOld, appendPmNew);

const addChatOld = `function addMessageToChat(sender, text, type = 'user') {
    const msgDiv = document.createElement('div');
    msgDiv.className = \`chat-message \${type === 'system' ? 'system-msg' : ''}\`;
    
    let contentHtml = text;
    if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif'))))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    if (type === 'system') {
        msgDiv.innerHTML = \`<span>\${contentHtml}</span>\`;
    } else {
        const isMy = sender === myUsername;
        msgDiv.innerHTML = \`
            <div class="chat-sender \${isMy ? 'highlight-cyan' : ''}">\${sender}</div>
            <div class="chat-text">\${contentHtml}</div>
        \`;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}`;

const addChatNew = `function addMessageToChat(sender, text, type = 'user', msgId = Date.now().toString() + Math.random().toString(36).substr(2, 5)) {
    const msgDiv = document.createElement('div');
    msgDiv.className = \`chat-message \${type === 'system' ? 'system-msg' : ''}\`;
    msgDiv.id = 'chatmsg-' + msgId;
    msgDiv.style.position = 'relative';
    
    let contentHtml = text;
    if (type !== 'system' && (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif'))))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    if (type === 'system') {
        msgDiv.innerHTML = \`<span>\${contentHtml}</span>\`;
    } else {
        const isMy = sender === myUsername;
        msgDiv.innerHTML = \`
            <div class="chat-sender \${isMy ? 'highlight-cyan' : ''}">\${sender}</div>
            <div class="chat-text">\${contentHtml}</div>
            <div class="msg-reactions" id="chatreactions-\${msgId}" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
            <div class="msg-reaction-btn chat-reaction-btn" onclick="showChatEmojiPicker('\${msgId}', '\${currentRoom}')" title="Tepki Ekle">😀</div>
        \`;
    }
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}`;

code = code.replace(addChatOld, addChatNew);

fs.writeFileSync('public/script.js', code);
console.log("JS patched emoji functions");
