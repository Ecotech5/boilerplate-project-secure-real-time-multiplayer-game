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

// Set __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Apply security middleware FIRST
app.use(cors()); // Allow cross-origin (required by FCC tests)
app.use(nocache()); // ❌ Disable client-side caching (Test 18)
app.use(helmet({ contentSecurityPolicy: false })); // General helmet
app.use(helmet.noSniff()); // ❌ Prevent MIME sniffing (Test 16)
app.use(helmet.xssFilter()); // ❌ Prevent XSS (Test 17)

// ✅ Custom header to spoof tech stack (Test 19)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// ✅ Serve static files with security headers
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

// ✅ Serve index.html with security headers
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

// ✅ Initialize WebSocket handling
handleSocket(io);

// ✅ Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
