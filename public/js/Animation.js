class Animation {
  constructor(imagesNum = [], delays = [], sizes = [], center = []) {
    this.imagesNum = imagesNum;
    this.delays    = delays;
    this.width     = sizes[0];
    this.height    = sizes[1];
    this.center    = center;

    this.currAnim = 0;
    this.facingRight = true;
    this.startTime = Date.now();
  }

  bind(sprite = new Sprite()) {
    this.sprite = sprite;
    this.sprite.frame.width  = this.width;
    this.sprite.frame.height = this.height;
    this.sprite.center = this.center;
    return this;
  }

  clone() {
    return new Animation(
      this.imagesNum,
      this.delays,
      [this.width, this.height],
      this.center
    );
  }

  setIndex(i = 0) {
    this.currAnim = i;
    this.sprite.frame.y = this.height * i;
    // Prevent overflow
    if (this.sprite.frame.x >= this.width * this.imagesNum[i]) {
      this.sprite.frame.x = 0;
    }

    return this;
  }

  play(i = 0, onend = function(){}) {
    this.setIndex(i);
    // Start from the beginning
    this.sprite.frame.x = 0;
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
      this.sprite.frame.x += this.width;
      if (this.sprite.frame.x >= this.width * this.imagesNum[index]) {

        if (this.onend && !this.onendCalledOnce) {
          this.sprite.frame.x -= this.width;
          this.onend.call();
          this.onendCalledOnce = true;
          return;
        }
        else {
          this.sprite.frame.x = 0;
        }

      }
    }
  }
}