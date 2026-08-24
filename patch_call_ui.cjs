const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const callOld = `                    <!-- EMBEDDED DISCORD CALL BARI -->
                    <div id="embedded-dm-call" class="embedded-dm-call compact hidden">
                        <div class="embedded-call-header">
                            <div class="call-user-title">
                                <span class="status-dot online pulse"></span>
                                <span id="embedded-call-name" class="call-name-text">Görüşme Devam Ediyor</span>
                            </div>
                            <div class="embedded-call-controls">
                                <button id="embed-resize-btn" class="call-icon-btn" title="Arama Ekranını Büyüt/Küçült">↕️</button>
                                <button id="embed-toggle-mic-btn" class="call-icon-btn mic-on" title="Mikrofon">🎙️</button>
                                <button id="embed-toggle-cam-btn" class="call-icon-btn cam-on" title="Kamera">📹</button>
                                <button id="embed-end-call-btn" class="call-icon-btn end-call" title="Aramayı Kapat">📵</button>
                            </div>
                        </div>
                        
                        <!-- Görüşme Avatarları / Video Grid -->
                        <div id="embedded-call-video-grid" class="embedded-call-video-grid">
                            <div class="call-avatar-card">
                                <div id="call-remote-avatar" class="user-avatar large">🎮</div>
                                <span id="call-remote-name" class="call-avatar-name">Arkadaş</span>
                                <video id="remote-dm-video" autoplay playsinline class="call-video-element"></video>
                                <audio id="remote-dm-audio" autoplay></audio>
                            </div>
                            <div class="call-avatar-card local">
                                <div id="call-local-avatar" class="user-avatar medium">🎮</div>
                                <span class="call-avatar-name">Sen</span>
                                <video id="local-dm-video" autoplay playsinline muted class="call-video-element"></video>
                            </div>
                        </div>

                        <!-- BOYUTLANDIRMA MANİVETASI -->
                        <div id="call-resize-handle" class="call-resize-handle" title="Sürükleyerek Boyutlandırın">⋮⋮</div>
                    </div>`;

const callNew = `                    <!-- EMBEDDED DISCORD CALL BARI -->
                    <div id="embedded-dm-call" class="embedded-dm-call compact hidden" style="background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                        <!-- Görüşme Avatarları / Video Grid -->
                        <div id="embedded-call-video-grid" class="embedded-call-video-grid" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 20px; width: 100%; height: 100%; min-height: 200px;">
                            
                            <div class="call-avatar-card local" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);">
                                <div id="call-local-avatar" class="user-avatar" style="width: 100px; height: 100px; font-size: 3rem; margin-bottom: 10px; box-shadow: 0 0 15px var(--neon-cyan);">🎮</div>
                                <span class="call-avatar-name" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Sen</span>
                                <video id="local-dm-video" autoplay playsinline muted class="call-video-element" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0;"></video>
                            </div>

                            <div class="call-avatar-card remote" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a1a1a; border-radius: 12px; overflow: hidden; box-shadow: 0 0 20px rgba(138, 43, 226, 0.2);">
                                <div id="call-remote-avatar" class="user-avatar" style="width: 100px; height: 100px; font-size: 3rem; margin-bottom: 10px; box-shadow: 0 0 15px var(--neon-purple);">🎮</div>
                                <span id="call-remote-name" class="call-avatar-name" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">Arkadaş</span>
                                <video id="remote-dm-video" autoplay playsinline class="call-video-element" style="position: absolute; top:0; left:0; width:100%; height:100%; object-fit: cover; opacity: 0;"></video>
                                <audio id="remote-dm-audio" autoplay></audio>
                            </div>
                        </div>

                        <!-- Discord Standard Bottom Controls -->
                        <div class="embedded-call-bottom-controls" style="display: flex; gap: 15px; padding: 15px; background: rgba(0,0,0,0.5); border-radius: 20px; position: absolute; bottom: 15px; backdrop-filter: blur(5px);">
                            <button id="embed-toggle-cam-btn" class="call-action-btn cam-on" title="Kamera" style="width: 48px; height: 48px; border-radius: 50%; background: #2f3136; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.2s;">📹</button>
                            <button id="embed-toggle-mic-btn" class="call-action-btn mic-on" title="Mikrofon" style="width: 48px; height: 48px; border-radius: 50%; background: #2f3136; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.2s;">🎙️</button>
                            <button id="embed-share-screen-btn" class="call-action-btn" title="Ekran Paylaş" style="width: 48px; height: 48px; border-radius: 50%; background: #2f3136; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.2s;">🖥️</button>
                            <button id="embed-end-call-btn" class="call-action-btn end-call" title="Aramayı Kapat" style="width: 48px; height: 48px; border-radius: 50%; background: #ed4245; color: white; border: none; font-size: 1.2rem; cursor: pointer; transition: 0.2s; box-shadow: 0 0 10px rgba(237,66,69,0.5);">📵</button>
                        </div>
                    </div>`;

html = html.replace(callOld, callNew);
fs.writeFileSync('public/index.html', html);
console.log("Call HTML patched");
