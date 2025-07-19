const players = {};
let collectible = randomPosition();

function randomPosition() {
  return {
    x: Math.floor(Math.random() * 600) + 50,
    y: Math.floor(Math.random() * 400) + 50,
  };
}

export function addPlayer(id) {
  players[id] = {
    id,
    x: 100,
    y: 100,
    color: 'blue',
    score: 0,
  };
}

export function removePlayer(id) {
  delete players[id];
}

export function handleMovement(id, direction) {
  const speed = 5;
  const player = players[id];
  if (!player) return;

  if (direction === 'left') player.x -= speed;
  if (direction === 'right') player.x += speed;
  if (direction === 'up') player.y -= speed;
  if (direction === 'down') player.y += speed;

  // Collision detection with collectible
  const dx = player.x - collectible.x;
  const dy = player.y - collectible.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 20) {
    player.score += 1;
    collectible = randomPosition();
  }
}

export function getGameState() {
  return {
    players: Object.values(players),
    collectible,
  };
}
