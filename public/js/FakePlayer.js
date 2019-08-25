var FakePlayer = (function () {

  return class extends Entity {
    constructor(x, y, className, name) {
      super(x, y);

      this.className = className;
      this.anim = animationList[className].clone();
      this.states = {
        IDLE:   0,
        RUN:    1,
        ATTACK: 2,
        WALK:   3
      };
      this.currentState = this.states.IDLE;

      this.name = name;

      this.facingDirection = new Vec2(1, 0);

      this._dustSpawner = new DustSpawner();
    }

    attack() {
      this.currentState = this.states.ATTACK;
      this.anim.play(this.currentState, () => {
        this.anim.pause();
        setTimeout(() => {
          this.currentState = this.states.IDLE;
          this.anim.resume();
          this.anim.play(0);
        }, 150);
      });
    }

    update() {
      if (this.currentState == this.states.RUN) {
        this._dustSpawner.create(this.x, this.y);
      }
      this._dustSpawner.update();
      
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
        this.y - this.anim.height - 5
      );
    }
  };
})();