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

// Essential security middlewares
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // disable for WebSocket compatibility
  crossOriginEmbedderPolicy: false // disable if using Canvas or fonts
}));

// ❌ Prevent MIME type sniffing (Test 16)
app.use(helmet.noSniff());

// ❌ Prevent XSS attacks (Test 17)
app.use(helmet.xssFilter()); // deprecated but still used in FCC tests

// ❌ Disable caching (Test 18)
app.use(nocache());

// ❌ Mask tech stack (Test 19)
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Handle WebSocket connections
handleSocket(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
