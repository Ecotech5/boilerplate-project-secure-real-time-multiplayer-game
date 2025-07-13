import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import nocache from 'nocache';
import { handleSocket } from './game/sockets.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ===== Middleware for Security Headers =====
app.use(helmet({
  contentSecurityPolicy: false, // Disable to prevent blocking inline scripts during development
}));
app.use(nocache()); // Prevent client-side caching

// 🛡️ Manually override X-Powered-By
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// Serve static files from /public with correct MIME type handling
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); // ❌ Prevent MIME type sniffing (Test 16)
  }
}));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ===== Socket.IO Game Logic =====
handleSocket(io);

// ===== Start Server =====
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
