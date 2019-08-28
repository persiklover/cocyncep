var HitTextManager = (function() {

  class HitText extends Entity {
    constructor(x = 0, y = 0, damage = 0, isCrit = false) {
      super(x, y);
      this.damage = damage;
      this.isCrit = isCrit;

      this.opcaity = 1;

      this._dead = false;
    }

    update() {
      this.y -= .25;
      this.opcaity -= .025;
      if (this.opcaity < 0) {
        this.opcaity = 0;

        this._dead = true;
      }
    }

    render(ctx = new CanvasRenderingContext2D) {
      var text = `-${this.damage}`;
      if (this.isCrit) {
        text = "crit " + text;
      }

      TextRenderer.render(ctx, text, this.x, this.y, {
        color:   "#ee0044",
        opcaity: this.opcaity
      });
    }
  }

  return class {
    constructor() {
      this.particles = [];
    }

    create(x = 0, y = 0, damage = 0, isCrit = false) {
      this.particles.push(new HitText(x, y, damage, isCrit));
    }

    update() {
      for (var i = 0; i < this.particles.length; i++) {
        var particle = this.particles[i];
        if (!particle) {
          continue;
        }

        if (particle._dead) {
          delete this.particles[i];
          this.particles = this.particles.filter(particle => particle != null);
        }
        else {
          particle.update();
        }
      }
    }
  };
})();