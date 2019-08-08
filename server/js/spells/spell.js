var Spell = class Spell {
  constructor(initiatorID, x, y) {
    this.initiatorID = initiatorID;
    this.pos = new Vec2(x, y);
  }
}