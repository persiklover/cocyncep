class Sprite extends Entity {
  constructor(img, x = 0, y = 0, center = { x: 0, y: 0 }, offset = { x: 0, y: 0 }) {
    super(x, y);

    this.img = img;

    // Transformations
    this.center = center;
    this.offset = offset;
  }

  render(ctx = new CanvasRenderingContext2D, params = {}) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.translate(-this.center.x, -this.center.y);
    if (params.rotation) {
      ctx.rotate(Math.toRadian(params.rotation));
    }
    ctx.translate(-this.offset.x, -this.offset.y);
    ctx.drawImage(this.img, 0, 0);
    ctx.restore();
  }
}