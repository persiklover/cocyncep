class Animation {
  constructor(img, imagesNum, delays, sizes, offset) {
    this.img = img;

    this.imagesNum = imagesNum;
    this.delays    = delays;
    this.width     = sizes[0];
    this.height    = sizes[1];

    this.startTime = Date.now();

    this.offset = offset;
    this.frame = { x: 0, y: 0 };
    this.currAnim = 0;
    this.facingRight = true;
  }

  clone() {
    return new Animation(
      this.img,
      this.imagesNum,
      this.delays,
      [this.width, this.height],
      this.offset
    );
  }

  setIndex(i) {
    this.currAnim = i;
    this.frame.y = this.height * i;
    // Prevent overflow
    if (this.frame.x >= this.width * this.imagesNum[i]) {
      this.frame.x = 0;
    }

    return this;
  }

  play(i=0, onend=function() {}) {
    this.setIndex(i);
    // Start from the beginning
    this.frame.x = 0;
    this.startTime = Date.now();
    // Set onend callback
    this.onend = onend;
    this.onendCalledOnce = false;

    return this;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  update() {
    if (this.paused) {
      return;
    }

    let index = this.currAnim;
    let elapsed = (Date.now() - this.startTime);
    if (elapsed > this.delays[index]) {
      this.startTime = Date.now();
      this.frame.x += this.width;
      if (this.frame.x >= this.width * this.imagesNum[index]) {

        if (this.onend && !this.onendCalledOnce) {
          this.frame.x -= this.width;
          this.onend.call();
          this.onendCalledOnce = true;
          return;
        }
        else {
          this.frame.x = 0;
        }

      }
    }
  }

  render(ctx, x, y) {
    ctx.save();

    ctx.translate(0, -this.offset.y);
    if (this.facingRight) {
      ctx.translate(-this.offset.x, 0);
    }
    else {
      ctx.translate(-this.width + this.offset.x, 0);
    }

    ctx.scale((this.facingRight) ? 1 : -1, 1);
    ctx.drawImage(
      this.img,
      this.frame.x,
      this.frame.y,
      this.width,
      this.height,
      (this.facingRight) ? x : -x - this.width,
      y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}