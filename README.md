# Vinyl Pantry

A personal archive of a vinyl record collection: albums by genre, artist, decade, and where they came from.

Plain HTML/CSS/JS, no build step. Dark theme with a full-bleed, pinned photo background (glassmorphism cards on top) — hosted on GitHub Pages.

## Structure

- `index.html` (Vinyls) — the one section page
- `about.html` — the personal story
- `css/style.css` — shared styles, including the dark/glass theme and the per-page (`body[data-page]`) background photo
- `js/main.js` — shared nav + data-rendering helpers, plus the EN / PT-BR language toggle (`t()`, `tf()`, `data-pt` attributes)
- `data/vinyls.json` — one entry per record; the page reads it and renders cards
- `data/wishlist.json` — records to pick up next
- `images/vinyls/` — album cover art (mirrored locally from Spotify's CDN)
- `images/backgrounds/` — the full-bleed hero photo used across pages
- `source-material/` — photos/notes with raw info to be transcribed into `data/vinyls.json` (not for direct publishing, just working source)

## Viewing locally

Because pages fetch their `data/*.json` via `fetch()`, opening the HTML files directly (`file://`) may be blocked by the browser's CORS policy. Serve the folder instead, e.g.:

```
python3 -m http.server
```

then visit `http://localhost:8000`.

## Adding content

Add a new object to `data/vinyls.json` (and a cover image under `images/vinyls/`) — no other changes needed, the page picks it up automatically. For PT-BR, add a `<field>_pt` sibling to a JSON item's field when it needs its own translation (see `js/main.js`'s `tf()`); static page copy is translated via `data-pt` attributes directly in the HTML.

## About page

`about.html`'s intro paragraph is a placeholder ("Add your story here.") — write the actual story in both `data-pt` (PT-BR) and the element body (EN) when ready.
