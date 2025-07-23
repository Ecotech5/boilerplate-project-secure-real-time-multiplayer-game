import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import nocache from 'nocache';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // ✅ Added CORS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Enable CORS for testing
app.use(cors({ origin: '*' }));

// Security and parsing middleware
app.use(nocache());
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Testing routes (for FCC)
import fcctestingRoutes from './routes/fcctesting.js';
fcctestingRoutes(app);

// Game socket logic
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Game state
const players = {};
const collectibles = [];

// Utility
function randomPosition() {
  return {
    x: Math.floor(Math.random() * 500),
    y: Math.floor(Math.random() * 500)
  };
}

// Collectible generation
function generateCollectible() {
  const position = randomPosition();
  const collectible = {
    id: Date.now(),
    position
  };
  collectibles.push(collectible);
  io.emit('newCollectible', collectible);
}

// Socket.IO logic
io.on('connection', (socket) => {
  const playerId = socket.id;
  players[playerId] = {
    id: playerId,
    position: randomPosition(),
    score: 0
  };

  socket.emit('init', {
    player: players[playerId],
    players,
    collectibles
  });

  socket.broadcast.emit('newPlayer', players[playerId]);

  socket.on('move', (data) => {
    if (players[playerId]) {
      players[playerId].position = data.position;
      io.emit('playerMoved', players[playerId]);
    }
  });

  socket.on('collect', (id) => {
    const index = collectibles.findIndex(c => c.id === id);
    if (index !== -1) {
      collectibles.splice(index, 1);
      players[playerId].score += 1;
      io.emit('collected', { id, playerId });
    }
  });

  socket.on('disconnect', () => {
    delete players[playerId];
    io.emit('playerDisconnected', playerId);
  });
});

// Generate collectibles every 10 seconds
setInterval(generateCollectible, 10000);

// Start server
const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Testing support
import './tests/runner.js';
