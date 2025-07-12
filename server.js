import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import nocache from 'nocache';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { setupSocket } from './game/sockets.mjs';

config(); // Load environment variables

// Necessary for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ SECURITY MIDDLEWARES
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.noSniff());
app.use(nocache());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'PHP 7.4.3'); // Obfuscate tech stack
  next();
});

// ✅ STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROOT ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ SOCKET.IO HANDLER
setupSocket(io);

// ✅ FOR FCC TESTING (optional)
try {
  const fcctesting = await import('./freeCodeCamp/fcctesting.mjs');
} catch (err) {
  // No problem if missing
}

// ✅ START SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
