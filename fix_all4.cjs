const fs = require('fs');
let code = fs.readFileSync('public/script.js', 'utf8');

const buttons = [
    'embedResizeBtn', 'callResizeHandle', 'embedToggleMicBtn', 'embedToggleCamBtn',
    'embedEndCallBtn', 'callStripEndBtn', 'callStripReturnBtn', 'acceptCallBtn',
    'rejectCallBtn', 'startVoiceCallBtn', 'startVideoCallBtn', 'toggleRightSidebarBtn',
    'embedShareScreenBtn'
];

buttons.forEach(btn => {
    // just string replacement
    code = code.split(btn + ".addEventListener").join("if (" + btn + ") " + btn + ".addEventListener");
});

// Since I might have run multiple scripts and it might have prepended "if (btn) if (btn)", let's clean it up.
buttons.forEach(btn => {
    while (code.includes("if (" + btn + ") if (" + btn + ")")) {
        code = code.replace("if (" + btn + ") if (" + btn + ")", "if (" + btn + ")");
    }
});

fs.writeFileSync('public/script.js', code);
console.log("Added null checks part 4");
