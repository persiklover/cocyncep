var AnimatedObject = (function() {

  return class extends Entity {
    constructor(x = 0, y = 0, anim) {
      super(x, y);

      this.anim = anim;
    }

    update() {
      this.anim.update();
    }

    render(ctx) {
      this.anim.render(ctx, this.x, this.y);
    }
  };
})();