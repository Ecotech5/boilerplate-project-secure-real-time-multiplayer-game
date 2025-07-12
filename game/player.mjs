export class Player {
  constructor(id, x = 100, y = 100) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = 0;
    this.speed = 5;
    this.radius = 20;
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  move(direction) {
    switch (direction) {
      case 'left':
        this.x -= this.speed;
        break;
      case 'right':
        this.x += this.speed;
        break;
      case 'up':
        this.y -= this.speed;
        break;
      case 'down':
        this.y += this.speed;
        break;
    }
  }
}
