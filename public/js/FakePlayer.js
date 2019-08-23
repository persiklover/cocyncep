var FakePlayer = (function () {

  return class extends Entity {
    constructor(x, y, className, name) {
      super(x, y);

      this.className = className;
      this.anim = animationList[className].clone();
      this.states = {
        IDLE: 0,
        RUN: 1
      };
      this.currentState = this.states.IDLE;

      this.name = name;

      this.facingDirection = new Vec2(1, 0);
    }

    update() {
      this.anim.setIndex(this.currentState);
      this.anim.facingRight = this.facingDirection.x > 0;
      this.anim.update();
    }

    get facingRight() { return this.facingDirection.x > 0; }

    render(ctx) {
      this.anim.render(ctx, this.x, this.y);

      TextRenderer.render(
        ctx,
        this.name,
        this.x,
        this.y - this.anim.height - 5,
        {
          // color: "#000022"
        }
      );
    }
  };
})();