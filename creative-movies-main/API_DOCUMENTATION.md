# Creative Movies — API Documentation

This document describes the TMDb API usage, endpoints, environment configuration, authentication/session flow, watchlist sync, error handling, and example requests used by the Creative Movies project (React + Vanilla versions).

Important: Do NOT commit your TMDb API key into source control. Use the provided `.env.example` or `vanilla/config.example.js` and add your key locally. If you have previously committed your key, rotate it in the TMDb dashboard immediately.

---

## 1. Environment configuration

- React (Vite) app: create a `.env` in the project root with the following variable (Vite uses `VITE_` prefix):

```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

- Vanilla app: copy `vanilla/config.example.js` to `vanilla/config.js` and set `window.TMDB_API_KEY` there. Keep `config.js` out of version control.

```
// vanilla/config.js (example — DO NOT commit this file)
window.TMDB_API_KEY = 'your_tmdb_api_key_here';
```

## 2. Base endpoints used

- Base URL: `https://api.themoviedb.org/3`
- Image base: `https://image.tmdb.org/t/p/{size}{path}` (e.g., `w500`)

Used endpoints (client-side):

- Trending: `GET /trending/movie/week` — trending movie list
- Search: `GET /search/movie` — search movies by query
- Movie details: `GET /movie/{movie_id}` — details for single movie
- Credits: `GET /movie/{movie_id}/credits` — cast and crew
- Genres: `GET /genre/movie/list` — available genres
- Discover: `GET /discover/movie` — filter/discover movies by criteria
- Account/watchlist endpoints (server-assisted or client with session):
  - `GET /account/{account_id}/watchlist/movies` — get watchlist
  - `POST /account/{account_id}/watchlist` — add/remove watchlist (requires `session_id`)

All requests require `api_key` query param OR a valid `session_id` where relevant for account endpoints.

## 3. Example requests

Curl (trending):

```
curl "https://api.themoviedb.org/3/trending/movie/week?api_key=YOUR_KEY"
```

Fetch (vanilla / browser):

```javascript
const res = await fetch(`${TMDB_BASE}/trending/movie/week?api_key=${window.TMDB_API_KEY}`);
const json = await res.json();
```

Axios (React `src/modules/apiModule.ts`):

```ts
const resp = await axios.get('/trending/movie/week', { baseURL: 'https://api.themoviedb.org/3', params: { api_key: import.meta.env.VITE_TMDB_API_KEY } });
```

## 4. Response examples (truncated)

Trending response shape (abridged):

```json
{
  "page":1,
  "results":[
    {"id":11,"title":"Star Wars","release_date":"1977-05-25","poster_path":"/path.jpg","vote_average":8.2}
  ]
}
```

Movie details (abridged):

```json
{
  "id":11,
  "title":"Star Wars",
  "overview":"...",
  "runtime":121,
  "genres":[{"id":12,"name":"Adventure"}],
  "poster_path":"/..."
}
```

Credits example (abridged):

```json
{
  "id":11,
  "cast":[{"cast_id":1,"name":"Mark Hamill"}, {"name":"Harrison Ford"}]
}
```

## 5. Authentication / session flow (TMDb v3) — server recommended

Notes: TMDb's authentication (v3) supports a request-token flow which requires redirecting the user to TMDb and then creating a session using your API key and the approved request token. Because client-side only apps expose `session_id` and the API key, for production you should implement server-side endpoints to keep secrets safe.

Client-side summary (for development / demo only — not recommended for production):

1. Create a request token:

```
GET https://api.themoviedb.org/3/authentication/token/new?api_key=YOUR_KEY
```

Response: `{ "success": true, "request_token": "..." }`

2. Redirect user to TMDb to approve: `https://www.themoviedb.org/authenticate/{request_token}`

3. After approval, create a session id:

```
POST https://api.themoviedb.org/3/authentication/session/new?api_key=YOUR_KEY
Body: { "request_token": "..." }
```

Response: `{ "success": true, "session_id": "..." }`

4. Use `session_id` to call account endpoints (watchlist):

```
GET https://api.themoviedb.org/3/account?api_key=YOUR_KEY&session_id=SESSION_ID
GET https://api.themoviedb.org/3/account/{account_id}/watchlist/movies?api_key=YOUR_KEY&session_id=SESSION_ID
```

To add/remove from watchlist:

```
POST https://api.themoviedb.org/3/account/{account_id}/watchlist?api_key=YOUR_KEY&session_id=SESSION_ID
Content-Type: application/json
Body: { "media_type": "movie", "media_id": MOVIE_ID, "watchlist": true }
```

Security recommendation: Implement these steps on a backend (server) so the API key and `session_id` are never embedded in client code. The backend can store `session_id` in a secure server session or return a short-lived token to the client.

## 6. Watchlist sync and local fallback

- The app keeps a local watchlist in `localStorage` as a convenience when the user is not authenticated.
- If a `session_id` is available (user signed-in via TMDb), sync logic should:
  - Fetch TMDb watchlist and merge with local list (avoid duplicates by `id`).
  - For user actions (add/remove), call TMDb watchlist API and update localStorage on success.
  - Handle network failures gracefully by queueing actions locally and retrying when online.

## 7. Error handling and rate limits

- Check HTTP status codes: on 4xx/5xx show user-friendly messages and log details for debugging.
- TMDb rate limits: TMDb imposes rate limits; expect occasional 429 (Too Many Requests). Implement simple retry/backoff and caching of common requests (e.g., genre list, configuration).

## 8. Caching and performance

- Cache genre list and image configuration responses in-memory or localStorage to avoid repeated calls.
- Use `image.tmdb.org` for static images and leverage browser caching.

## 9. Examples and snippets

- Adding to watchlist (axios example):

```ts
await axios.post(`https://api.themoviedb.org/3/account/${accountId}/watchlist`, {
  media_type: 'movie', media_id: movieId, watchlist: true
}, { params: { api_key: process.env.TMDB_API_KEY, session_id: SESSION_ID } });
```

- Search debounce suggestion (vanilla):

```js
let timer; input.addEventListener('input', e => { clearTimeout(timer); timer = setTimeout(()=> doSearch(e.target.value), 350); });
```

## 10. Troubleshooting

- 401 Unauthorized: check your `api_key` and that it's not expired or revoked.
- 404 Not Found: verify `movie_id` or endpoint path.
- 429 Too Many Requests: slow down requests, add caching, or request a higher rate from TMDb if your app needs it.

## 11. Security checklist

- Remove any committed `.env` or `config.js` from git history and rotate keys.
- Use server-side proxy for account operations and sensitive flows.
- Do not embed `session_id` or long-lived credentials in client code for production.

---

If you'd like, I can:
- Add concrete example server endpoints (Node/Express) implementing TMDb session flow and a proxy for watchlist calls.
- Generate Postman collection and example cURL files.
- Add the docs to `README.md` and create a `vanilla/README.md` with run instructions (I will link them next).

---

## 12. RESTful Proxy API (recommended)

For production it's strongly recommended to use a server-side proxy that keeps the TMDb API key and any `session_id` on the server. Below is a suggested RESTful contract your frontend can call. The server translates requests to TMDb and returns normalized responses.

Authentication between client ↔ server
- Use a short-lived server session cookie or an Authorization header. Do NOT place `TMDB_API_KEY` in the client.

Common server environment variables (example):

```
TMDB_API_KEY=your_tmdb_api_key_here
PORT=3000
```

API endpoints (server-side)

- GET /api/trending
  - Description: Returns trending movies (week)
  - Query: optional `limit`, `page`
  - Response: 200 { results: [ Movie ] }

- GET /api/search?q={query}&page={n}
  - Description: Search movies by query string
  - Response: 200 { results: [ Movie ] }

- GET /api/movies/:id
  - Description: Returns movie details and limited credits
  - Response: 200 { movie: MovieDetail }

- GET /api/watchlist
  - Description: Returns the authenticated user's watchlist. If no session, returns an empty array or server-stored fallback.
  - Auth: server session/cookie or `X-Session-Id` header
  - Response: 200 { watchlist: [ Movie ] }

- POST /api/watchlist
  - Description: Add movie to watchlist (server will call TMDb account/watchlist or store locally)
  - Body (JSON): `{ "media_type": "movie", "media_id": 550 }` or `{ "movie": { ... } }`
  - Response: 201 { added: { id: 550, title: "..." } }

- DELETE /api/watchlist/:id
  - Description: Remove movie from watchlist. Server will call TMDb API or remove from server DB/local store.
  - Response: 204 No Content

Error response format

All server errors use a simple JSON envelope:

```json
{ "error": "Descriptive message", "code": 500 }
```

Examples (curl)

Fetch trending via proxy:

```bash
curl -s "http://localhost:3000/api/trending" | jq '.'
```

Add to watchlist (client → proxy):

```bash
curl -X POST http://localhost:3000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"media_type":"movie","media_id":11}'
```

Delete from watchlist (proxy translates to TMDb POST with watchlist=false):

```bash
curl -X DELETE http://localhost:3000/api/watchlist/11
```

Express (Node) example

Below is an example minimal Express server that proxies selected endpoints to TMDb. It intentionally avoids storing secrets in source; it reads `TMDB_API_KEY` from env.

```js
// server/example-proxy.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const TMDB = axios.create({ baseURL: 'https://api.themoviedb.org/3' });
const API_KEY = process.env.TMDB_API_KEY;

function tmdbParams(params){ return Object.assign({ api_key: API_KEY }, params || {}); }

app.get('/api/trending', async (req, res) => {
  try{
    const r = await TMDB.get('/trending/movie/week', { params: tmdbParams({ page: req.query.page || 1 }) });
    res.json(r.data);
  } catch(e){ res.status(500).json({ error: 'Failed to fetch trending', code: 500 }) }
});

app.get('/api/movies/:id', async (req, res) => {
  try{
    const [m, credits] = await Promise.all([
      TMDB.get(`/movie/${req.params.id}`, { params: tmdbParams() }),
      TMDB.get(`/movie/${req.params.id}/credits`, { params: tmdbParams() }).catch(()=>({data:{cast:[]}}))
    ]);
    const out = Object.assign({}, m.data);
    out.cast = (credits.data.cast||[]).slice(0,6).map(c=>({ id:c.id, name:c.name, character:c.character }));
    res.json({ movie: out });
  } catch(e){ res.status(500).json({ error: 'Failed to fetch movie details', code: 500 }) }
});

// Helper to get account id when session exists
async function getAccountId(sessionId){
  const r = await TMDB.get('/account', { params: { api_key: API_KEY, session_id: sessionId } });
  return r.data.id;
}

app.get('/api/watchlist', async (req, res) => {
  const sessionId = req.cookies.session_id || req.header('X-Session-Id');
  if (!sessionId) return res.json({ watchlist: [] });
  try{
    const accountId = await getAccountId(sessionId);
    const r = await TMDB.get(`/account/${accountId}/watchlist/movies`, { params: { api_key: API_KEY, session_id: sessionId } });
    res.json({ watchlist: r.data.results || [] });
  } catch(e){ res.status(500).json({ error: 'Failed to fetch watchlist', code: 500 }) }
});

app.post('/api/watchlist', async (req, res) => {
  const sessionId = req.cookies.session_id || req.header('X-Session-Id');
  if (!sessionId) return res.status(401).json({ error: 'Not authenticated' });
  const { media_type, media_id } = req.body;
  if (!media_type || !media_id) return res.status(400).json({ error: 'Missing media_type or media_id' });
  try{
    const accountId = await getAccountId(sessionId);
    await TMDB.post(`/account/${accountId}/watchlist`, { media_type, media_id, watchlist: true }, { params: { api_key: API_KEY, session_id: sessionId } });
    res.status(201).json({ added: { media_type, media_id } });
  } catch(e){ res.status(500).json({ error: 'Failed to add to watchlist', code: 500 }) }
});

// Delete route maps to TMDb POST with watchlist=false
app.delete('/api/watchlist/:id', async (req, res) => {
  const sessionId = req.cookies.session_id || req.header('X-Session-Id');
  if (!sessionId) return res.status(401).json({ error: 'Not authenticated' });
  try{
    const accountId = await getAccountId(sessionId);
    await TMDB.post(`/account/${accountId}/watchlist`, { media_type: 'movie', media_id: Number(req.params.id), watchlist: false }, { params: { api_key: API_KEY, session_id: sessionId } });
    res.status(204).end();
  } catch(e){ res.status(500).json({ error: 'Failed to remove from watchlist', code: 500 }) }
});

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log('Proxy server listening on', port));
```

Notes on the example
- The server expects `TMDB_API_KEY` in env. Do not hardcode your key.
- The server reads `session_id` from cookies or an `X-Session-Id` header; in production you'd use proper session management and authentication.
- The server implements `DELETE /api/watchlist/:id` for frontend convenience even though TMDb uses POST with `watchlist:false`.

Schema: Movie (used in responses)

```json
{
  "id": 11,
  "title": "Star Wars",
  "overview": "...",
  "poster_path": "/abc.jpg",
  "release_date": "1977-05-25",
  "vote_average": 8.2
}
```

Frontend guidance
- Use the server proxy endpoints instead of calling TMDb directly in production.
- For local demos (vanilla), include `vanilla/config.js` only for development and copy values from a safe source; do not commit it.

---

## 13. Next steps I can implement for you

- Add the example proxy file `server/example-proxy.js` to the repo (without any real key) and a small `package.json` for that server so you can `npm install` and `node server/example-proxy.js` locally with your env.
- Generate a Postman collection for the proxy and TMDb endpoints.

If you want the server example added to the repo now, tell me and I will create `server/example-proxy.js` and a `server/README.md` with run instructions.
