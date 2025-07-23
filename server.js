// server.js  ── ES‑module version
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import nocache from 'nocache';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleSocket } from './game/sockets.mjs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// __dirname helper for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ───────────────────────────────────────
   1)  Core security + testing middleware
   ─────────────────────────────────────── */
// CORS ‑‑ lets FCC’s test runner access the site
app.use(cors({ origin: '*' }));

// Disable client‑side caching
app.use(nocache());

// Helmet (single call, default protections)
app.use(helmet({
  contentSecurityPolicy: false   // keep CSP off for this small app
}));

// Manually spoof X‑Powered‑By for FCC test #19
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

/* ───────────────────────────────────────
   2)  Static assets
   ─────────────────────────────────────── */
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res) {
    // keep static assets from being cached
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Allow client‑side ES‑module imports from /game
app.use('/game', express.static(path.join(__dirname, 'game')));

/* ───────────────────────────────────────
   3)  Root route
   ─────────────────────────────────────── */
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ───────────────────────────────────────
   4)  Socket.IO game logic
   ─────────────────────────────────────── */
handleSocket(io);

/* ───────────────────────────────────────
   5)  Start server
   ─────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
