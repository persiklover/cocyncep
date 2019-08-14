var Player = (function() {

  return class extends Playable {
    constructor(x, y, className, name) {
      super(x, y);

      this.className = className;
      this.anim = animationList[className].clone();
      this.states = {
        IDLE: 0,
        RUN:  1
      };
      this.currentState = this.states.IDLE;
      
      this.name = name;

      this.facingDirection = new Vec2(1, 0);
    }

    update() {
      switch (this.currentState) {
        case this.states.IDLE: {
          if (this.dx || this.dy) {
            this.currentState = this.states.RUN;
          }
          break;
        }
        case this.states.RUN: {
          if (this.dx == 0 && this.dy == 0) {
            this.currentState = this.states.IDLE;
          }
          break;
        }
      }

      this.anim.setIndex(this.currentState);
      this.anim.facingRight = this.facingDirection.x > 0;
      this.anim.update();

      if (this.dx || this.dy) {
        var delta = new Vec2(this.dx, this.dy)
          .add(this.facingDirection.scale(.35));
  
        if (this.dx != 0) {
          this.x += delta.x;
        }

        if (this.dy != 0) {

          this.y += delta.y;
        }
      }

      // super.update();
    }

    get facingRight() { return this.facingDirection.x > 0; }

    render(ctx) {
      this.anim.render(ctx, this.x, this.y);
    }
  };
})();