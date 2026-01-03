# BJJ Products Store

React + Express + SQLite app that serves 10 Brazilian Jiu Jitsu products from a database and renders them in a grid UI.

## Prerequisites
- Node.js 16+ and npm

## Install
```bash
npm install
```

## Run (dev)
Starts Express API (port 4000) and React dev server (port 3000) together.
```bash
npm run dev
```
Then open http://localhost:3000

## Build (prod)
```bash
npm run build
```
(Serve the `build/` output with any static server and point API to /api/products)

## API
- `GET /api/products` — returns the 10 products from SQLite
- `GET /api/health` — simple health check

## Data seeding
- On first run, `server.js` seeds SQLite from `public/bjj-products.json` into `data/products.db`.
- Product images are served from `public/images/`.

## File layout
- `server.js` — Express API, SQLite init/seed, routes
- `data/products.db` — SQLite database (auto-created/seeded)
- `public/bjj-products.json` — seed data source
- `public/images/` — product images
- `public/index.html` — HTML template for React
- `src/index.jsx` — React entry point
- `src/ProductPage.jsx` — main UI component; fetches `/api/products`
- `src/ProductPage.css` — styles for the grid/cards
- `src/index.css` — global styles
- `package.json` — scripts and dependencies (Express, SQLite, React, concurrently)
- `.gitignore` — excludes node_modules, build artifacts, editor files

## Scripts
- `npm run dev` — run API + React dev servers
- `npm run server` — run API only (port 4000)
- `npm start` — React dev server only (port 3000)
- `npm run build` — production build
- `npm test` — CRA test runner

## Notes
- CRA dev mode uses React StrictMode, so you may see duplicate fetches (second is often 304). This disappears in production builds.
