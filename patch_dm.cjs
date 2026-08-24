const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const appendPmOld = `function appendPmMessage(sender, text) {
    const isMy = sender === myUsername;
    const msgDiv = document.createElement('div');
    msgDiv.className = \`dm-message \${isMy ? 'my-pm' : 'other-pm'}\`;
    
    let contentHtml = text;
    if (text.startsWith('data:image') || (text.startsWith('http') && (text.endsWith('.png') || text.endsWith('.jpg') || text.endsWith('.gif') || text.includes('tenor.com') || text.includes('giphy.com')))) {
        contentHtml = \`<img src="\${text}" class="chat-img-attachment">\`;
    }

    msgDiv.innerHTML = \`
        <div class="dm-sender">\${isMy ? myDisplayName : sender}</div>
        <div class="dm-text">\${contentHtml}</div>
    \`;
    pmMessagesContainer.appendChild(msgDiv);
    pmMessagesContainer.scrollTop = pmMessagesContainer.scrollHeight;
}`;

const appendPmNew = `function appendPmMessage(sender, text, isRead = false) {
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

code = code.replace(appendPmOld, appendPmNew);

const openDmOld = `        if (data.success) {
            data.history.forEach(m => appendPmMessage(m.sender, m.message));
        }`;
const openDmNew = `        if (data.success) {
            data.history.forEach(m => appendPmMessage(m.sender, m.message, m.read));
            socket.emit('mark_read', { sender: friendObj.username, receiver: myUsername });
        }`;
code = code.replace(openDmOld, openDmNew);

const recvDmOld = `    if (currentPmTarget === otherUser && !dmChatContainer.classList.contains('hidden')) {
        appendPmMessage(data.sender, data.message);
    }`;
const recvDmNew = `    if (currentPmTarget === otherUser && !dmChatContainer.classList.contains('hidden')) {
        appendPmMessage(data.sender, data.message);
        if (data.sender !== myUsername) {
            socket.emit('mark_read', { sender: data.sender, receiver: myUsername });
        }
    }`;
code = code.replace(recvDmOld, recvDmNew);

code += `\nsocket.on('messages_read', (data) => {
    if (currentPmTarget === data.by && !dmChatContainer.classList.contains('hidden')) {
        document.querySelectorAll('.my-pm .read-receipt').forEach(el => el.textContent = '✔️ Görüldü');
    }
});\n`;

fs.writeFileSync('public/script.js', code);
console.log('Patched DM');
