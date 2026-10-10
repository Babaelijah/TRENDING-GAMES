# Flick the Ball leaderboard (Cloudflare Worker + D1)

The game works without this: scores are kept on the player's device.
Deploy this to get a worldwide leaderboard. You need a free Cloudflare account.

```bash
cd worker
npm install -g wrangler
wrangler login

# 1. create the database, then paste the printed database_id into wrangler.toml
wrangler d1 create flick-leaderboard

# 2. create the table
wrangler d1 execute flick-leaderboard --remote --file=schema.sql

# 3. deploy; it prints a URL like https://flick-leaderboard.<you>.workers.dev
wrangler deploy
```

Then open `index.html`, set `LEADERBOARD_URL` to that URL, commit and push.

- `GET /scores` returns the top 20.
- `POST /scores` with `{ "name": "Ada", "score": 120 }` adds a score (1 to 300).

Scores come from the browser, so a determined player can fake one. The Worker rejects
impossible scores and rate-limits by IP, which is enough for a casual game.
