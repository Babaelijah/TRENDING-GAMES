// Pretends to be N players walking around the stadium. Usage: node loadtest.js [players] [seconds] [url]
const WebSocket = require('ws');
const N = +process.argv[2] || 200, SECS = +process.argv[3] || 20, URL = process.argv[4] || 'ws://localhost:8787';
const scenes = ['locker', 'locker', 'locker', 'training', 'tunnel'];
let open = 0, snaps = 0, bytes = 0, chats = 0, maxOnline = 0, lat = [];
const bots = [];
for (let i = 0; i < N; i++) setTimeout(() => {
  const ws = new WebSocket(URL); let x = 300 + Math.random() * 1200, y = 400 + Math.random() * 400, t = 0;
  ws.on('open', () => { open++; ws.send(JSON.stringify({ t: 'join', name: 'Bot' + i, num: i % 99, skin: i % 4, hair: [0, 1, 2, 4][i % 4], x, y, sc: scenes[i % scenes.length] }));
    const iv = setInterval(() => { t += 0.1; x += Math.cos(t + i) * 12; y += Math.sin(t * 1.3 + i) * 8; if (ws.readyState === 1) ws.send(JSON.stringify({ t: 'pos', x, y, vx: 100, vy: 0, face: 1 })); }, 100);
    const ci = setInterval(() => { if (ws.readyState === 1 && Math.random() < 0.15) ws.send(JSON.stringify({ t: 'chat', text: 'Go team ' + i })); }, 2000);
    ws.on('close', () => { clearInterval(iv); clearInterval(ci); open--; }); });
  ws.on('message', d => { bytes += d.length; const m = JSON.parse(d); if (m.t === 'snap') { snaps++; maxOnline = Math.max(maxOnline, m.online); } if (m.t === 'chat') chats++; });
  bots.push(ws);
}, i * 15);
const t0 = Date.now();
setTimeout(() => {
  console.log(`players connected: ${open}/${N}   max "online" seen by clients: ${maxOnline}`);
  console.log(`snapshots received: ${snaps}   chats received: ${chats}   data received: ${(bytes / 1024 / 1024).toFixed(1)} MB over ${SECS}s`);
  fetch(URL.replace('ws', 'http') + '/stats').then(r => r.json()).then(s => { console.log('server /stats:', JSON.stringify(s)); bots.forEach(b => b.close()); setTimeout(() => process.exit(0), 300); }).catch(() => process.exit(0));
}, SECS * 1000 + N * 15);
