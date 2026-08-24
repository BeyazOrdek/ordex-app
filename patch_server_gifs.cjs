const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const oldGifApi = `app.get('/api/gifs', async (req, res) => {
  const query = req.query.q || 'trending';
  try {
    const tenorRes = await fetch(\`https://tenor.com/search/\${encodeURIComponent(query)}-gifs\`);
    const html = await tenorRes.text();
    
    // Basit HTML kazıma
    const gifMatches = html.match(/src="(https:\\/\\/media\\.tenor\\.com\\/[^"]+\\.gif)"/g);
    let gifs = [];
    if (gifMatches) {
        gifs = [...new Set(gifMatches.map(m => m.replace('src="', '').replace('"', '')))].slice(0, 20);
    }
    res.json({ success: true, gifs });
  } catch (e) {
    res.json({ success: false });
  }
});`;

const newGifApi = `app.get('/api/gifs', async (req, res) => {
  const query = req.query.q || 'trending';
  try {
    const tenorRes = await fetch(\`https://tenor.com/search/\${encodeURIComponent(query)}-gifs\`);
    const html = await tenorRes.text();
    
    // Extract JSON state
    let gifs = [];
    const match = html.match(/"results":(\\[.*?\\]),"next"/);
    if (match && match[1]) {
        try {
            const results = JSON.parse(match[1]);
            gifs = results.map(r => {
                if (r.media_formats) {
                    if (r.media_formats.gif) return r.media_formats.gif.url;
                    if (r.media_formats.tinygif) return r.media_formats.tinygif.url;
                }
                return null;
            }).filter(url => url !== null).slice(0, 20);
        } catch(err) {
            console.error('Tenor JSON parse error', err);
        }
    }
    
    // Fallback if JSON extraction fails
    if (gifs.length === 0) {
        const gifMatches = html.match(/src="(https:\\/\\/media\\.tenor\\.com\\/[^"]+\\.gif)"/g);
        if (gifMatches) {
            gifs = [...new Set(gifMatches.map(m => m.replace('src="', '').replace('"', '')))].slice(0, 20);
        }
    }
    
    res.json({ success: true, gifs });
  } catch (e) {
    res.json({ success: false });
  }
});`;

code = code.replace(oldGifApi, newGifApi);
fs.writeFileSync('server.js', code);
console.log('Patched server GIF API');
