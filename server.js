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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Apply security middleware
app.use(cors());
app.use(nocache());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.noSniff());

// ✅ Set headers for XSS protection and fake PHP header
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// ✅ Serve static files from public/
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Powered-By', 'PHP 7.4.3');
  }
}));

// ✅ Serve game/ directory for browser module imports
app.use('/game', express.static(path.join(__dirname, 'game')));

// ✅ Serve index.html manually
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

// ✅ Start server and WebSocket logic
handleSocket(io);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
