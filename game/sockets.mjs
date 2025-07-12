import { addPlayer, removePlayer, handleMovement, getGameState } from './game.mjs';

export function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);
    const player = addPlayer(socket.id);

    socket.emit('init', { id: socket.id });

    socket.on('move', (direction) => {
      handleMovement(socket.id, direction);
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      removePlayer(socket.id);
    });
  });

  // Emit game state to all clients every 100ms
  setInterval(() => {
    io.emit('state', getGameState());
  }, 100);
}
