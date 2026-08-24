const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const buttons = [
    'embedResizeBtn', 'callResizeHandle', 'embedToggleMicBtn', 'embedToggleCamBtn',
    'embedEndCallBtn', 'callStripEndBtn', 'callStripReturnBtn', 'acceptCallBtn',
    'rejectCallBtn', 'startVoiceCallBtn', 'startVideoCallBtn', 'toggleRightSidebarBtn',
    'embedShareScreenBtn'
];

buttons.forEach(btn => {
    code = code.replace(new RegExp(btn + '\\\\.addEventListener', 'g'), 'if (' + btn + ') ' + btn + '.addEventListener');
});

fs.writeFileSync('public/script.js', code);
console.log("Added null checks part 3");
