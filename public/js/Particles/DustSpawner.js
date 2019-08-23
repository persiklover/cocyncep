var DustSpawner = (function() {

  var dustTexture = Loader.loadImage("img/dust.png");

  class Dust {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
      this.width  = Math.randomInt(3, 7);
      this.height = Math.randomInt(3, 7);

      this.rotationSpeed = Math.randomInt(-9, 9) / 10;
      this.rotation = 0;
      this.alpha = 1;
      this.birthTime = Date.now();
      this.lifeTime = Math.randomInt(1, 3) * 1000;

      this._dead = false;
    }

    update() {
      if (Date.now() - this.birthTime > 1000) {
        this._dead = true;
      }

      this.y -= .1;
      this.rotation += this.rotationSpeed;

      this.alpha -= .015;
      if (this.alpha < 0) {
        this.alpha = 0;
      }
    }

    render(ctx = new CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.toRadian(this.rotation));
      ctx.globalAlpha = this.alpha;
      ctx.drawImage(
        dustTexture,
        0,
        0,
        1,
        1,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
      ctx.restore();
    }
  }

  return class {
    constructor() {
      this.particles = [];

      this.startTime = Date.now();
    }

    create(x = 0, y = 0) {
      if (Date.now() - this.startTime > 250) {
        var amount = Math.randomInt(1, 3);
        for (var i = 0; i < amount; i++) {
          var offsetX = Math.randomInt(-3, 3);
          var offsetY = Math.randomInt(-3, 1);
          this.particles.push(new Dust(x + offsetX, y + offsetY));
        }

        this.startTime = Date.now();
      }
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