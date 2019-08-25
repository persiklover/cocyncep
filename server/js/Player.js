var Player = (function() {
  
  return class {
    constructor(id = "", name = "", className = "", pos = new Vec2) {
      this.id        = id;
      this.name      = name;
      this.className = className;
      this.pos       = pos;

      this.lvl        = 1;
      this.hp         = 10;
      this.maxHP      = 10;
      this.xp         = 0;
      this.xpRequired = 10;
      
      this.def = 10;
    }

    dealDamage(damage = 0) {
      damage -= (damage / 100 * this.def);
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
      }

      return damage;
    }

    reborn() {
      
    }

    merge(obj) {
      for (let key in obj) {
        if (!this.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }

    addXP(xp) {
      this.xp += xp;
      if (this.xp >= this.xpRequired) {
        this.levelUp();
      }
    }

    levelUp() {
      this.lvl++;

      this.hp = Math.floor(this.maxHP + (this.maxHP / 100 * 40));
      this.maxHP = this.hp;

      this.xp = this.xp - this.xpRequired;
      this.xpRequired = (this.lvl + 2) * this.xpRequired;
    }
  }
})();