export class Player {
  constructor(id, x = Math.floor(Math.random() * 500), y = Math.floor(Math.random() * 500)) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = 0;
  }

  move(direction) {
    const speed = 5;
    switch (direction) {
      case 'left':
        this.x -= speed;
        break;
      case 'right':
        this.x += speed;
        break;
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
    }
  }
}
