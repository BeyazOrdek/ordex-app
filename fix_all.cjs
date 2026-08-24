const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

// I will just add null checks to all of the specific call UI buttons since they are the most likely ones.
const buttons = [
    'embedResizeBtn', 'callResizeHandle', 'embedToggleMicBtn', 'embedToggleCamBtn',
    'embedEndCallBtn', 'callStripEndBtn', 'callStripReturnBtn', 'acceptCallBtn',
    'rejectCallBtn', 'startVoiceCallBtn', 'startVideoCallBtn', 'toggleRightSidebarBtn',
    'embedShareScreenBtn'
];

buttons.forEach(btn => {
    // Check if there is a .addEventListener
    const regex = new RegExp('^(\\\\s*)' + btn + '\\\\.addEventListener', 'gm');
    code = code.replace(regex, '$1if (' + btn + ') ' + btn + '.addEventListener');
});

fs.writeFileSync('public/script.js', code);
console.log("Added null checks");
