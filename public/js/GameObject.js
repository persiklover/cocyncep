class GameObject extends Sprite {
  constructor(img, x = 0, y = 0, center = { x: 0, y: 0 }, offset = { x: 0, y: 0 }) {
    super(img, x, y, center, offset);

    this.dx = 0;
    this.dy = 0;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx, params = {}) {
    super.render(ctx, params);
  }
}