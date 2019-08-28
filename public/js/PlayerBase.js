var PlayerBase = (function () {

  return class extends Entity {
    constructor(x = 0, y = 0, prof = "", name ="") {
      super(x, y);

      this.dx = 0;
      this.dy = 0;

      this.prof = prof;
      this.anim = animationList[prof].clone();
      this.states = {
        IDLE:   0,
        RUN:    1,
        ATTACK: 2
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

      this.x += this.dx;
      this.y += this.dy;
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