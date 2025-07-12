export class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = typeof x === 'number' ? x : Math.floor(Math.random() * 500);
    this.y = typeof y === 'number' ? y : Math.floor(Math.random() * 500);
    this.score = 0;
  }

  move(direction) {
    const speed = 5;
    switch (direction) {
      case 'left': this.x -= speed; break;
      case 'right': this.x += speed; break;
      case 'up': this.y -= speed; break;
      case 'down': this.y += speed; break;
    }
  }
}
