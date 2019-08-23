var Skill = (function() {

  return class {
    constructor(initiatorID, x = 0, y = 0) {
      this.initiatorID = initiatorID;
      this.pos = new Vec2(x, y);
      
      this.damage = 1;
    }
  }
})();