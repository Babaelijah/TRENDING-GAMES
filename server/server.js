// NFL Live online server: players walking around the same stadium rooms, chat and emotes.
// One small Node process comfortably handles several hundred players.
//   PORT=8787 node server.js
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs'), path = require('path');
// The same server also hosts the game page, so the Render address itself opens NFL Live.
const GAME_DIR = path.join(__dirname, '..', 'football');
const FILES = { '/': 'index.html', '/index.html': 'index.html', '/football': 'index.html', '/football/': 'index.html', '/rosters.js': 'rosters.js', '/football/rosters.js': 'rosters.js' };
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

const PORT = process.env.PORT || 8787;
const ROOM_CAP = +process.env.ROOM_CAP || 50;     // players per room instance
const MAX_ONLINE = +process.env.MAX_ONLINE || 2000;
const TICK_MS = 100;                               // 10 snapshots per second
const SCENES = { locker: [1760, 900], tunnel: [2900, 720], training: [1280, 720], press: [1280, 720] };
const BAD = /\b(fuck|shit|bitch|cunt|nigg\w*|fag\w*|rape|kill yourself)\b/i;

const rooms = new Map();   // key "scene#n" -> { key, scene, players: Map }
const clients = new Set();
let nextId = 1;

function roomFor(scene) {
  for (let n = 1; ; n++) {
    const key = `${scene}#${n}`;
    let r = rooms.get(key);
    if (!r) { r = { key, scene, players: new Map() }; rooms.set(key, r); }
    if (r.players.size < ROOM_CAP) return r;
  }
}
function leaveRoom(c) {
  const r = c.room; if (!r) return;
  r.players.delete(c.id); c.room = null;
  broadcast(r, { t: 'leave', id: c.id });
  if (r.players.size === 0 && !r.key.endsWith('#1')) rooms.delete(r.key);
}
function enterRoom(c, scene) {
  if (!SCENES[scene]) scene = 'locker';
  leaveRoom(c);
  const r = roomFor(scene); c.room = r; c.p.sc = scene; r.players.set(c.id, c);
  const [w, h] = SCENES[scene];
  c.p.x = Math.min(Math.max(c.p.x, 0), w); c.p.y = Math.min(Math.max(c.p.y, 0), h);
  send(c, { t: 'room', room: r.key, online: clients.size });
}
function send(c, msg) { if (c.ws.readyState === 1) c.ws.send(JSON.stringify(msg)); }
function broadcast(r, msg, except) { const s = JSON.stringify(msg); r.players.forEach(c => { if (c !== except && c.ws.readyState === 1) c.ws.send(s); }); }

const clean = (s, n) => String(s == null ? '' : s).replace(/[<>&"'`\\]/g, '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, n);
const num = (v, lo, hi, d) => { v = +v; return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };

const server = http.createServer((req, res) => {
  const h = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  const url = req.url.split('?')[0];
  if (FILES[url]) {
    const f = path.join(GAME_DIR, FILES[url]);
    return fs.readFile(f, (e, buf) => { if (e) { res.writeHead(404, h); return res.end('{"error":"game files not found"}'); } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)], 'Cache-Control': 'no-cache' }); res.end(buf); });
  }
  if (url === '/stats') {
    const byScene = {}; rooms.forEach(r => { byScene[r.scene] = (byScene[r.scene] || 0) + r.players.size; });
    res.writeHead(200, h); return res.end(JSON.stringify({ online: clients.size, rooms: rooms.size, byScene }));
  }
  if (req.url === '/health') { res.writeHead(200, h); return res.end('{"ok":true}'); }
  res.writeHead(404, h); res.end('{"error":"not found"}');
});

const wss = new WebSocketServer({ server, maxPayload: 2048 });
wss.on('connection', (ws, req) => {
  if (clients.size >= MAX_ONLINE) { ws.close(1013, 'full'); return; }
  const c = { ws, id: nextId++, room: null, joined: false, last: 0, chatAt: 0, msgs: 0, winStart: Date.now(), p: { name: 'Player', num: 8, skin: 1, hair: 0, x: 880, y: 620, vx: 0, vy: 0, face: 1, sc: 'locker', em: null, emAt: 0 }, alive: true };
  clients.add(c);
  ws.on('pong', () => { c.alive = true; });
  ws.on('message', raw => {
    const now = Date.now();
    if (now - c.winStart > 1000) { c.winStart = now; c.msgs = 0; }
    if (++c.msgs > 40) return;                         // flood control
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    if (!m || typeof m.t !== 'string') return;
    if (m.t === 'join') {
      c.p.name = clean(m.name, 20) || 'Player'; c.p.num = num(m.num, 0, 99, 8) | 0; c.p.skin = num(m.skin, 0, 3, 1) | 0; c.p.hair = [0, 1, 2, 4].includes(+m.hair) ? +m.hair | 0 : 0;
      c.p.x = num(m.x, 0, 3000, 880); c.p.y = num(m.y, 0, 1000, 620);
      c.joined = true; enterRoom(c, m.sc); send(c, { t: 'welcome', id: c.id, online: clients.size, room: c.room.key }); return;
    }
    if (!c.joined) return;
    if (m.t === 'pos') {
      const [w, h] = SCENES[c.p.sc] || SCENES.locker;
      c.p.x = num(m.x, -30, w + 30, c.p.x); c.p.y = num(m.y, 0, h, c.p.y); c.p.vx = num(m.vx, -400, 400, 0); c.p.vy = num(m.vy, -400, 400, 0); c.p.face = +m.face < 0 ? -1 : 1;
    } else if (m.t === 'scene') {
      if (m.sc !== c.p.sc && SCENES[m.sc]) { c.p.x = num(m.x, 0, 3000, 200); c.p.y = num(m.y, 0, 1000, 500); enterRoom(c, m.sc); }
    } else if (m.t === 'chat') {
      if (now - c.chatAt < 900) return; c.chatAt = now;
      let text = clean(m.text, 120); if (!text) return; if (BAD.test(text)) text = '*'.repeat(Math.min(text.length, 12));
      broadcast(c.room, { t: 'chat', id: c.id, name: c.p.name, text });
    } else if (m.t === 'emote') {
      if (now - c.p.emAt < 700) return; c.p.emAt = now; const e = ['wave', 'fire', 'flex', 'clap', 'gg'].includes(m.e) ? m.e : 'wave';
      broadcast(c.room, { t: 'emote', id: c.id, e });
    } else if (m.t === 'ping') send(c, { t: 'pong', online: clients.size });
  });
  ws.on('close', () => { leaveRoom(c); clients.delete(c); });
  ws.on('error', () => {});
});

// positions of everyone in a room, ten times a second (only to rooms that changed)
setInterval(() => {
  rooms.forEach(r => {
    if (!r.players.size) return;
    const list = []; r.players.forEach(c => { const p = c.p; list.push([c.id, p.name, p.num, p.skin, p.hair, Math.round(p.x), Math.round(p.y), Math.round(p.vx), Math.round(p.vy), p.face]); });
    const msg = JSON.stringify({ t: 'snap', online: clients.size, n: r.players.size, p: list });
    r.players.forEach(c => { if (c.ws.readyState === 1) c.ws.send(msg); });
  });
}, TICK_MS);
// drop dead connections
setInterval(() => { clients.forEach(c => { if (!c.alive) return c.ws.terminate(); c.alive = false; try { c.ws.ping(); } catch (e) {} }); }, 20000);

server.listen(PORT, () => console.log(`NFL Live server listening on :${PORT}  (room cap ${ROOM_CAP})`));
