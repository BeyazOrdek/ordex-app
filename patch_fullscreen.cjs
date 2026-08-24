const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Add fullscreen button
html = html.replace(
  '<button id="load-video-btn" class="cyber-btn">Sıraya Ekle / Yükle</button>',
  '<button id="load-video-btn" class="cyber-btn">Sıraya Ekle / Yükle</button>\n                        <button id="fullscreen-btn" class="icon-btn" title="Tam Ekran" style="font-size: 1.2rem; padding: 0 10px;">🔲</button>'
);

// Add music option
html = html.replace(
  '<option value="screen">💻 Ekran Paylaşımı & Sohbet</option>',
  '<option value="screen">💻 Ekran Paylaşımı & Sohbet</option>\n                    <option value="music">🎵 Birlikte Müzik Dinleme</option>'
);

// Add music player UI
const musicUI = `
                    <div id="music-party-ui" class="video-wrapper cyberpunk-box hidden" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 360px; background: linear-gradient(135deg, #111, #222);">
                        <div class="music-disc" style="width: 150px; height: 150px; border-radius: 50%; background: #000; border: 4px solid var(--neon-purple); display: flex; align-items: center; justify-content: center; animation: spin 4s linear infinite; margin-bottom: 20px;">
                            <div style="width: 30px; height: 30px; background: #222; border-radius: 50%;"></div>
                        </div>
                        <h3 id="music-title" class="glow-purple">Şu an çalmıyor...</h3>
                        <div id="music-youtube-container" style="display: none; width: 0; height: 0;">
                            <div id="music-yt-player"></div>
                        </div>
                    </div>
`;

html = html.replace(
  '<div id="watch-party-ui"',
  musicUI + '\n                    <div id="watch-party-ui"'
);

fs.writeFileSync('public/index.html', html);
console.log("HTML patched");
