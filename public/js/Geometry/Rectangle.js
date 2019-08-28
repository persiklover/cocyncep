class Rectangle {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width  = width;
    this.height = height;
  }

  intersects(x = 0, y = 0) {
    return (x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height);
  }
}