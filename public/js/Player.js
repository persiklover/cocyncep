var Player = (function() {

  return class extends Playable {
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

      this.lvl        = 1;
      this.hp         = 10;
      this.maxHP      = 10;
      this.xp         = 0;
      this.xpRequired = 10;
      this.unlockedSkills = 0;
    }

    dealDamage(damage = 0) {
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
      }
    }

    update() {
      var delta = new Vec2();
      if (this.dx || this.dy) {
        delta = new Vec2(this.dx, this.dy)
          .add(this.facingDirection.scale(.35));
  
        if (!this.rooted) {
          if (this.dx != 0) {
            this.x += delta.x;
          }
  
          if (this.dy != 0) {
            this.y += delta.y;
          }
        }
      }

      switch (this.currentState) {
        case this.states.IDLE: {
          if (this.dx || this.dy) {
            this.currentState = this.states.RUN;
          }
          break;
        }
        case this.states.RUN: {
          // if (delta.x < 0 || delta.y < 0) {
          //   this.currentState = this.states.WALK;
          // }
          if (this.dx == 0 && this.dy == 0) {
            this.currentState = this.states.IDLE;
          }
          break;
        }
        case this.states.WALK: {
          if (this.dx == 0 && this.dy == 0) {
            this.currentState = this.states.IDLE;
          }
          else if (delta.x >= 0 && delta.y >= 0) {
            this.currentState = this.states.RUN;
          }
          break;
        }
      }

      // Show current state
      // console.log(Object.keys(this.states)[this.currentState]);

      this.anim.setIndex(this.currentState);
      this.anim.facingRight = this.facingDirection.x > 0;
      this.anim.update();
    }

    get facingRight() { return this.facingDirection.x > 0; }

    get top() { return this.y - this.anim.height - 15; }

    render(ctx) {
      this.anim.render(ctx, this.x, this.y);


      TextRenderer.render(
        ctx,
        this.name,
        this.x,
        this.y - this.anim.height - 8,
        {
          color: "#ee22aa"
        }
      );
    }
  };
})();