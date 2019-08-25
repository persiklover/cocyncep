var SkillArrow = (function() {

  return class extends GameObject{
    constructor(x = 0, y = 0, dx = 0, dy = 0) {
      var arrowTexture = Loader.loadImage("img/skills/arrow.png");
      
      super(arrowTexture, x, y, { x: 0, y: 2 }, { x: 0, y: 12 });

      this.dx = dx;
      this.dy = dy;
      this.rotation = new Vec2(dx, dy).direction();
    }

    render(ctx = new CanvasRenderingContext2D) {
      super.render(ctx, { rotation: this.rotation });
    }
  };
})();