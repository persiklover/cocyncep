class Sprite extends Entity {
  constructor(img, x = 0, y = 0, offset = {x: 0, y: 0}) {
    super(x, y);

    this.img = img;

    // Transformations
    this.offset = offset;
  }

  render(ctx) {
    ctx.save();
    // ctx.scale(this.scale.x, this.scale.y);
    ctx.drawImage(this.img, this.x - this.offset.x, this.y - this.offset.y);
    ctx.restore();
  }
}