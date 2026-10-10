# NFL Live online server

This is what makes the stadium multiplayer: everyone who walks into the locker room, tunnel,
training room or press room sees the other players walking around, can chat in bubbles above their
head, and can send emotes. It also gives the "PLAYERS ONLINE NOW" counter on the menu.

The game page on GitHub Pages cannot do this by itself, so this small server has to run somewhere.

## Put it online (about 5 minutes, free)

1. Create a free account at https://render.com and connect your GitHub.
2. In Render: **New > Blueprint**, pick the `TRENDING-GAMES` repo. It reads `render.yaml` in the
   repo root and creates the service `nfl-live-server`.
   (Or **New > Web Service**, root directory `server`, build `npm install`, start `node server.js`.)
3. When it is live Render shows an address like `https://nfl-live-server.onrender.com`.
4. Open `football/index.html`, find this line near the top of the online section, and paste your address
   with `wss://` instead of `https://`:

   ```js
   const DEFAULT_SERVER = 'wss://nfl-live-server.onrender.com';
   ```
5. Commit and push. Players now see each other.

To test without editing anything, add it to the page address:
`https://babaelijah.github.io/TRENDING-GAMES/football/?server=wss://nfl-live-server.onrender.com`

Notes about the free plan: Render puts free services to sleep after 15 minutes with no visitors.
The first player after a quiet spell waits about 30 to 60 seconds while it wakes up (the game still
works, the online part connects a moment later). The $7/month Starter plan stays awake all the time.

## What it can handle

I load tested it with 200 simulated players walking and chatting at the same time:

| | result |
|---|---|
| players connected | 200 / 200 |
| server CPU | about 8% of one core |
| memory | about 65 MB |
| rooms | split automatically (50 players per room) so no room is a mob |

Run it yourself: `cd server && npm install && node server.js`, then in another terminal
`node loadtest.js 200 20` (players, seconds).

Each player receives roughly 17 KB/s of position updates in a full room. At 200 players the free plan is
fine. If you grow to several thousand at once, the next step is a bigger plan and sending only nearby players.

## Settings (environment variables)

| name | default | meaning |
|---|---|---|
| `PORT` | 8787 | port to listen on (Render sets this for you) |
| `ROOM_CAP` | 50 | players per room before a new copy of the room opens |
| `MAX_ONLINE` | 2000 | refuse new connections above this |

## What is protected

Names and chat are cleaned, messages are length-limited and rate-limited, a basic bad-word filter masks
the worst words, and flooding connections are ignored. Positions are trusted from the player's browser,
which is fine for walking around a locker room. There are no accounts yet, so anyone can use any name.

## Endpoints

- `wss://your-server` is the game connection
- `GET /stats` returns `{ online, rooms, byScene }`
- `GET /health` is a health check
