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

// 📍 Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Basic Security Middleware
app.use(cors());
app.use(nocache());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.noSniff());
app.disable('x-powered-by'); // Disable default Express header

// ✅ FCC Test 19 — Spoof X-Powered-By
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// ✅ FCC Test 17 — X-XSS-Protection
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ FCC Test 18 — X-Content-Type-Options and full caching disable
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('X-Powered-By', 'PHP 7.4.3');
    },
  })
);

// ✅ Allow ES Module imports from /game
app.use('/game', express.static(path.join(__dirname, 'game')));

// ✅ Serve index.html manually with correct headers
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public/index.html');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  res.sendFile(filePath);
});

// ✅ Attach game socket logic
handleSocket(io);

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
