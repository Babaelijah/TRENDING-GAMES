// Flick the Ball leaderboard: Cloudflare Worker + D1.
//   GET  /scores  -> top 20 scores
//   POST /scores  -> { name, score } adds a score
// The game is played in the browser, so scores are only sanity-checked
// (1..MAX_SCORE), not proven. Fine for a casual leaderboard.

const MAX_SCORE = 300;          // 3 rounds x 100 points
const MIN_GAP_MS = 5000;        // one submission per IP every 5 seconds
const recent = new Map();

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...cors } });

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const url = new URL(req.url);
    if (url.pathname !== '/scores') return json({ error: 'not found' }, 404);

    if (req.method === 'GET') {
      const { results } = await env.DB
        .prepare('SELECT name, score FROM scores ORDER BY score DESC, created_at ASC LIMIT 20')
        .all();
      return json({ scores: results });
    }

    if (req.method === 'POST') {
      const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
      const now = Date.now();
      if (now - (recent.get(ip) || 0) < MIN_GAP_MS) return json({ error: 'slow down' }, 429);
      recent.set(ip, now);
      if (recent.size > 5000) recent.clear();

      let body;
      try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
      const name = String(body.name || '').replace(/[^\p{L}\p{N} _.-]/gu, '').trim().slice(0, 16);
      const score = Number.isInteger(body.score) ? body.score : NaN;
      if (!name) return json({ error: 'name required' }, 400);
      if (!(score >= 1 && score <= MAX_SCORE)) return json({ error: 'bad score' }, 400);

      await env.DB.prepare('INSERT INTO scores (name, score, created_at) VALUES (?, ?, ?)').bind(name, score, now).run();
      return json({ ok: true }, 201);
    }

    return json({ error: 'method not allowed' }, 405);
  },
};
