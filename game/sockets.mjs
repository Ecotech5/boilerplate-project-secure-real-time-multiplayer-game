import { addPlayer, removePlayer, handleMovement, getGameState } from '../public/game.mjs';

/**
 * Handles all Socket.IO connection logic.
 * @param {import('socket.io').Server} io
 */
export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    addPlayer(socket.id);

    // Send ID and full game state including collectible
    socket.emit('init', {
      id: socket.id,
      state: getGameState()
    });

    socket.on('move', (direction) => {
      handleMovement(socket.id, direction);
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      removePlayer(socket.id);
    });
  });

  // Broadcast game state to all clients every 100ms
  setInterval(() => {
    io.emit('state', getGameState());
  }, 100);
}
