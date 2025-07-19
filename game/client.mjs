const socket = io();
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerId = null;
let gameState = null;

socket.on('init', ({ id }) => {
  playerId = id;
});

socket.on('state', (state) => {
  gameState = state;
  drawGame();
});

function drawGame() {
  if (!gameState || !playerId) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw collectible
  ctx.beginPath();
  ctx.arc(gameState.collectible.x, gameState.collectible.y, 10, 0, 2 * Math.PI);
  ctx.fillStyle = 'yellow';
  ctx.fill();

  // Draw players
  for (const player of gameState.players) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`Score: ${player.score}`, player.x - 20, player.y - 20);
  }
}

window.addEventListener('keydown', (e) => {
  let direction;
  if (e.key === 'ArrowLeft') direction = 'left';
  if (e.key === 'ArrowRight') direction = 'right';
  if (e.key === 'ArrowUp') direction = 'up';
  if (e.key === 'ArrowDown') direction = 'down';
  if (direction) {
    socket.emit('move', direction);
  }
});
