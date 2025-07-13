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

// ✅ Apply essential security middlewares
app.use(cors());
app.use(nocache()); // ❌ Prevent caching (Test 18)

// ✅ Helmet base config
app.use(helmet({
  contentSecurityPolicy: false, // Needed for WebSocket
  crossOriginEmbedderPolicy: false
}));

// ✅ Test 16: Prevent MIME sniffing
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// ✅ Test 17: Prevent XSS attacks
app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ Test 19: Fake "PHP" header
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// ✅ Static file serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ✅ Initialize socket connections
handleSocket(io);

// ✅ Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
