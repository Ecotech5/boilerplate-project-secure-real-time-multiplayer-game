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

// ✅ Essential security middlewares
app.use(cors());
app.use(nocache()); // ✅ Prevent caching (Test 18)
app.use(helmet({ contentSecurityPolicy: false })); // base helmet
app.use(helmet.noSniff()); // ✅ Prevent MIME sniffing (Test 16)
app.use(helmet.xssFilter()); // ✅ Prevent XSS (Test 17, deprecated but FCC expects it)

// ✅ Set fake powered-by header (Test 19)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// ✅ Serve static files with all headers
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Powered-By', 'PHP 7.4.3');
  }
}));

// ✅ Serve the homepage manually with headers
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
