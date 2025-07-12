import { Player } from './Player.mjs';
import { Collectible } from './Collectible.mjs';

const players = {};
const collectible = new Collectible();

export function addPlayer(id) {
  players[id] = new Player(id);
  return players[id];
}

export function removePlayer(id) {
  delete players[id];
}

export function handleMovement(id, direction) {
  const player = players[id];
  if (player) {
    player.move(direction);
    if (collectible.isCollected(player)) {
      player.score++;
      collectible.respawn();
    }
  }
}

export function getGameState() {
  return {
    players: Object.values(players),
    collectible
  };
}
