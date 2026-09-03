// MoveBox for Windows: serves the game from a local port so the camera, workers and model files all behave like a normal https page.
const { app, BrowserWindow, session, globalShortcut } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.bin': 'application/octet-stream', '.png': 'image/png', '.css': 'text/css', '.wasm': 'application/wasm' };
function serve(root) {
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html';
      const f = path.normalize(path.join(root, p));
      if (!f.startsWith(root)) { res.writeHead(403); res.end(); return; }
      fs.readFile(f, (err, data) => {
        if (err) { res.writeHead(404); res.end('not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
        res.end(data);
      });
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv.address().port));
  });
}
app.commandLine.appendSwitch('ignore-gpu-blocklist');      // make sure WebGL gets the real GPU
app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(permission === 'media' || permission === 'fullscreen'));
  session.defaultSession.setPermissionCheckHandler((wc, permission) => permission === 'media' || permission === 'fullscreen');
  const port = await serve(path.join(__dirname, 'www'));
  const win = new BrowserWindow({ width: 1280, height: 720, fullscreen: true, autoHideMenuBar: true, backgroundColor: '#06070B', title: 'MoveBox',
    webPreferences: { backgroundThrottling: false, contextIsolation: true, sandbox: true } });
  win.loadURL(`http://127.0.0.1:${port}/index.html?local=1`);
  globalShortcut.register('F11', () => win.setFullScreen(!win.isFullScreen()));
  globalShortcut.register('Escape', () => { if (win.isFullScreen()) win.setFullScreen(false); });
});
app.on('window-all-closed', () => app.quit());
