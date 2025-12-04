# Vanilla Demo — Creative Movies

Quick start for the vanilla JS demo (no bundler or framework):

1. Copy the example config and add your TMDb API key:

```powershell
cd vanilla
Copy-Item .\config.example.js .\config.js
# then edit config.js and replace the placeholder with your API key
```

2. Serve the `vanilla` folder from a local HTTP server (ES modules require a web server):

```powershell
# from project root
cd vanilla
python -m http.server 8000
# or
npx http-server -p 8000
```

3. Open `http://localhost:8000` in your browser.

Security note: do not commit `config.js` (contains your API key). For production, implement a backend proxy and keep keys server-side.

See `../API_DOCUMENTATION.md` for complete API usage and auth/session flow details.