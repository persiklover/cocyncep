var SpellArrow = class SpellArrow extends Spell {
  constructor(initiatorID, x, y, dx, dy) {
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
  }
  
  update() {
    this.pos.add(this.speed);
  }
}