# Nasru Editz — Portfolio Website

A dark, cinematic one-page portfolio built with plain HTML/CSS/JS (no build step,
no dependencies to install). Open `index.html` in a browser, or upload the whole
folder to any static host (Netlify, Vercel, GitHub Pages, or your own hosting).

## Structure
```
index.html        All page content and sections
css/style.css      Design tokens (colours, type, spacing) + all styling
js/main.js         Nav, video showcase filtering, lightboxes, pricing calculator
assets/img/        Profile photo + the two view-count proof screenshots
```

## Things you'll likely want to update later

- **Video links** — the portfolio videos load straight from your Google Drive
  links (in `js/main.js`, the `VIDEOS` array). Keep those files shared as
  "Anyone with the link can view" or the preview player won't load for visitors.
- **Pricing numbers** — the "Build your monthly package" calculator in `js/main.js`
  (the `data-price` attributes in `index.html` and the `recalc()` function) use
  placeholder rates. Adjust them to match your real pricing.
- **WhatsApp number** — used in the contact section and the quote button:
  search for `918438629947` in `index.html` and `js/main.js` if it ever changes.
- **Fonts** — loaded from Google Fonts (Fraunces, Inter, Space Grotesk) via a
  `<link>` tag in `index.html`, so an internet connection is needed for them to
  load; the page still works without it, just with fallback system fonts.

## Notes on the video thumbnails
Cards try to load a poster frame straight from Google Drive
(`drive.google.com/thumbnail?id=...`). This works for most publicly shared
files; if a particular thumbnail doesn't load, the card gracefully falls back
to a styled placeholder — clicking it still plays the real video.
