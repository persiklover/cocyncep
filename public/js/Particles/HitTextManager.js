var HitTextManager = (function() {

  class HitText extends Entity {
    constructor(x = 0, y = 0, damage = 0) {
      super(x, y);
      this.damage = damage;

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
      TextRenderer.render(ctx, `-${this.damage}`, this.x, this.y, {
        color:   "#ee0044",
        opcaity: this.opcaity
      });
    }
  }

  return class {
    constructor() {
      this.particles = [];
    }

    create(x = 0, y = 0, damage = 0) {
      this.particles.push(new HitText(x, y, damage));
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