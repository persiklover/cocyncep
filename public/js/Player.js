var Player = (function() {

  return class extends Playable {
    constructor(x = 0, y = 0, prof = "", name = "") {
      super(x, y);

      this.prof = prof;
      this.name = name;

      this.sprite = new Sprite(texturesList[prof], x, y);
      this.anim = animationList[prof].clone().bind(this.sprite);

      this.states = {
        IDLE:    0,
        RUN:     1,
        ATTACK:  2
      };
      this.currentState = this.states.IDLE;
      this.facingDirection = new Vec2(1, 0);

      this.lvl        = 1;
      this.maxHP      = 10;
      this.hp         = 10;
      this.hpRegen    = 0;

      this.xp         = 0;
      this.xpRequired = 10;
      this.unlockedSkills = 1;

      this.startTime = Date.now();
      this._dustSpawner = new DustSpawner();
    }

    dealDamage(damage = 0) {
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
      }
    }

    addHP(val = 0) {
      this.hp += val;
      if (this.hp > this.maxHP) {
        this.hp = this.maxHP;
      }
    }

    update() {
      if (Date.now() - this.startTime > 1000) {
        this.addHP(this.hpRegen);
        console.log('add', this.hp);
        this.startTime = Date.now();
      }

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
      this.sprite.x = this.x;
      this.sprite.y = this.y;

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
          else {
            this._dustSpawner.create(this.x, this.y);
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

      this._dustSpawner.update();

      // Show current state
      // console.log(Object.keys(this.states)[this.currentState]);

      this.anim.setIndex(this.currentState);
      this.anim.facingRight = this.facingDirection.x > 0;
      this.anim.update();
    }

    get facingRight() { return this.facingDirection.x > 0; }

    get top() { return this.y - this.anim.height - 15; }

    renderHP(ctx = new CanvasRenderingContext2D) {
      ctx.save();
      var persentage = (this.hp / this.maxHP);
      var color = persentage > .66 ? "lime" : persentage > .33 ? "orange" : "red";
      var w = 40;
      var h = 3;
      var x = this.x - w / 2;
      var y = this.y - this.anim.height - 13;

      ctx.fillStyle = "rgba(200,200,200,.75)";
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = color;
      ctx.fillRect(x, y, w * persentage, h);
      
      ctx.restore();
    }

    renderName(ctx = new CanvasRenderingContext2D) {
      TextRenderer.render(
        ctx,
        this.name,
        this.x,
        this.y - this.anim.height - 8,
        {
          // color: "#ee22aa"
        }
      );
    }

    render(ctx = new CanvasRenderingContext2D) {
      this.sprite.render(ctx, {
        scaleX: (this.facingDirection.x > 0) ? 1 : -1
      });
    }
  };
})();