class Sprite extends Entity {
  constructor(img, x = 0, y = 0, center = { x: 0, y: 0 }, offset = { x: 0, y: 0 }) {
    super(x, y);

    this.img = img;
    this.frame = new Rectangle(0, 0, this.img.width, this.img.height);

    // Transformations
    this.center = center;
    this.offset = offset;
  }

  get width()  { return this.img.width; }
  get height() { return this.img.height; }

  render(ctx = new CanvasRenderingContext2D, transform = {}, filter) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // ctx.translate(-this.offset.x, -this.offset.y);

    if (transform.rotation) {
      ctx.rotate(Math.toRadian(transform.rotation));
    }

    if (transform.scaleX) {
      ctx.scale(transform.scaleX, 1);
    }

    ctx.translate(-this.center.x, -this.center.y);

    if (!filter) {
      ctx.drawImage(
        this.img,
        this.frame.x,
        this.frame.y,
        this.frame.width,
        this.frame.height,
        0,
        0,
        this.frame.width,
        this.frame.height
      );
      ctx.restore();
    }
    else {
      ctx2.clearRect(0, 0, WIDTH * scale, HEIGHT * scale);
      ctx2.save();

      ctx2.drawImage(
        this.img,
        this.frame.x,
        this.frame.y,
        this.frame.width,
        this.frame.height,
        0,
        0,
        this.frame.width,
        this.frame.height
      );

      var dx = 0;
      var dy = 0;
      var dw = this.frame.width;
      var dh = this.frame.height;

      var imageData = ctx2.getImageData(
        dx,
        dy,
        dw,
        dh
      );
      var pixels = imageData.data;

      for (var i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] == 0) {
          continue;
        }

        var r = pixels[i];
        var g = pixels[i + 1];
        var b = pixels[i + 2];
        var a = pixels[i + 3];
        // console.log(filter);
        var colorData = filter(r, g, b, a);

        pixels[i] = colorData[0]; // red
        pixels[i + 1] = colorData[1]; // green
        pixels[i + 2] = colorData[2]; // blue
        pixels[i + 3] = colorData[3]; // alpha

        // Test
        // pixels[i]   = colorData[0]; //red
        // pixels[i+1] = colorData[1]; //green
        // pixels[i+2] = colorData[2]; //blue
        // pixels[i+3] = 255; //blue
      }
      ctx2.putImageData(imageData, dx, dy);
      ctx2.restore();
      ctx.drawImage(canvas2, 0, 0);
      ctx.restore();
    }
  }

  getBoundingBox() {
    return new Rectangle(
      this.x - this.center.x,
      this.y - this.center.y,
      this.img.width,
      this.img.height
    );
  }
}