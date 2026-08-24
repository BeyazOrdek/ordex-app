const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const oldMusicUI = `
                    <div id="music-party-ui" class="video-wrapper cyberpunk-box hidden" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 360px; background: linear-gradient(135deg, #111, #222);">
                        <div class="music-disc" style="width: 150px; height: 150px; border-radius: 50%; background: #000; border: 4px solid var(--neon-purple); display: flex; align-items: center; justify-content: center; animation: spin 4s linear infinite; margin-bottom: 20px;">
                            <div style="width: 30px; height: 30px; background: #222; border-radius: 50%;"></div>
                        </div>
                        <h3 id="music-title" class="glow-purple">Şu an çalmıyor...</h3>
                        <div id="music-youtube-container" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; overflow: hidden;">
                            <div id="music-yt-player"></div>
                        </div>
                    </div>
`;

const newMusicUI = `
                    <div id="music-party-ui" class="video-wrapper cyberpunk-box hidden" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; background: linear-gradient(135deg, #0a0a0a, #1a1a1a); border-radius: 16px; position: relative; overflow: hidden;">
                        
                        <!-- Background Blur -->
                        <div id="music-bg-blur" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; filter: blur(30px); opacity: 0.3; z-index: 0;"></div>
                        
                        <div style="z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 500px; padding: 20px;">
                            <!-- Disk / Thumbnail -->
                            <div class="music-disc paused" id="music-disc-elem" style="width: 180px; height: 180px; border-radius: 50%; background: #000; border: 4px solid var(--neon-purple); display: flex; align-items: center; justify-content: center; animation: spin 4s linear infinite; margin-bottom: 25px; box-shadow: 0 0 30px rgba(138, 43, 226, 0.4); overflow: hidden; position: relative;">
                                <img id="music-thumbnail" src="" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8; display: none;">
                                <div style="position: absolute; width: 40px; height: 40px; background: #111; border-radius: 50%; border: 2px solid #333; z-index: 2;"></div>
                            </div>
                            
                            <!-- Info -->
                            <h3 id="music-title" style="font-size: 1.4rem; font-weight: bold; color: #fff; text-align: center; margin-bottom: 5px; text-shadow: 0 0 10px rgba(255,255,255,0.2); width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Şu an çalmıyor...</h3>
                            <p id="music-artist" style="font-size: 1rem; color: #aaa; margin-bottom: 15px; text-align: center;">Bekleniyor</p>
                            
                            <!-- Added By -->
                            <div style="display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.4); padding: 5px 12px; border-radius: 20px; margin-bottom: 25px; font-size: 0.85rem; color: #ddd;">
                                <span id="music-added-by">Henüz kimse şarkı eklemedi</span>
                            </div>
                            
                            <!-- Progress Bar -->
                            <div style="width: 100%; display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #bbb;">
                                <span id="music-time-current">00:00</span>
                                <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; position: relative; overflow: hidden;">
                                    <div id="music-progress-bar" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); border-radius: 3px; transition: width 0.5s linear;"></div>
                                </div>
                                <span id="music-time-total">00:00</span>
                            </div>
                        </div>

                        <div id="music-youtube-container" style="position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; overflow: hidden;">
                            <div id="music-yt-player"></div>
                        </div>
                    </div>
`;

html = html.replace(oldMusicUI.trim(), newMusicUI.trim());
fs.writeFileSync('public/index.html', html);
console.log('Patched music UI in HTML');
