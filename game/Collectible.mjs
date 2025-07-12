export class Collectible {
  constructor() {
    this.radius = 10;
    this.respawn();
  }

  respawn() {
    this.x = Math.floor(Math.random() * 700) + 50;
    this.y = Math.floor(Math.random() * 400) + 50;
  }

  isCollected(player) {
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + player.radius;
  }
}
