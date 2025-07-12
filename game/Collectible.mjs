export class Collectible {
  constructor() {
    this.respawn();
  }

  respawn() {
    // Random x,y between 0 and 500
    this.x = Math.floor(Math.random() * 500);
    this.y = Math.floor(Math.random() * 500);
  }

  isCollected(player) {
    // Calculate Euclidean distance
    const dist = Math.sqrt(
      (player.x - this.x) ** 2 + (player.y - this.y) ** 2
    );

    // Consider collected if within 20 pixels radius
    return dist < 20;
  }
}
