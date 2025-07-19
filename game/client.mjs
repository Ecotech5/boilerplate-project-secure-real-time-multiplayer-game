const socket = io();

// Create the canvas and context
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = 800;
canvas.height = 600;

const playerRadius = 20;
const collectibleRadius = 10;

let gameState = { players: [], collectible: {} };
let playerId = null;

// Draw game state
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw collectible
  if (gameState.collectible) {
    ctx.beginPath();
    ctx.arc(gameState.collectible.x, gameState.collectible.y, collectibleRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'gold';
    ctx.fill();
    ctx.closePath();
  }

  // Draw all players
  gameState.players.forEach(player => {
    ctx.beginPath();
    ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
    ctx.fillStyle = player.id === playerId ? 'blue' : 'gray';
    ctx.fill();
    ctx.closePath();

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`Score: ${player.score}`, player.x - 20, player.y - 30);
  });
}

// Handle server updates
socket.on('init', data => {
  playerId = data.id;
  gameState = data.state;
  drawGame();
});

socket.on('update', state => {
  gameState = state;
  drawGame();
});

// Handle player input
window.addEventListener('keydown', e => {
  let direction = null;

  if (e.key === 'ArrowUp') direction = 'up';
  if (e.key === 'ArrowDown') direction = 'down';
  if (e.key === 'ArrowLeft') direction = 'left';
  if (e.key === 'ArrowRight') direction = 'right';

  if (direction) {
    socket.emit('move', direction);
  }
});
