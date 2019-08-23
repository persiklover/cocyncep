var SkillArrow = (function() {

  return class extends Skill {
    constructor(initiatorID, x = 0, y = 0, dx = 0, dy = 0) {
      super(initiatorID, x, y);

      this.type = 'arrow';
      this.damage = 10;

      this.speed = new Vec2(dx, dy);
      if (this.speed.x > 0) {
        this.facingRight = true;
      }
      else if (this.speed.x < 0) {
        this.facingRight = false;
      }

      this.birthTime = Date.now();
      this.lifeTime = 3000;

      this._dead = false;
    }

    update() {
      if (Date.now() - this.birthTime > this.lifeTime) {
        this._dead = true;
      }
      else {
        this.pos.add(this.speed);
      }
    }
  };
})(); 