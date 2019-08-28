var Stats = (function() {

  return class {
    constructor(prof = "", lvl = 1) {
      // Defaults
      this.maxHP   = 100;
      this.hpQ     = 25;
      this.hpRegen = 2;

      this.def   = 8;
      this.defQ  = 25;

      this.speed = 1;
      this.crit  = 8;
      
      switch (prof) {
        case "scientist":
          this.hpQ  = 45;
          this.defQ = 30;
          break;
        case "archer":
          this.speed = 1.35;
          this.crit = 13;
        break;
      }

      this.update(lvl);
    }

    addHP(val = 0) {
      this.hp += val;
      if (this.hp > this.maxHP) {
        this.hp = this.maxHP;
      }
    }

    update(lvl = 1) {
      this.maxHP = 100;
      this.maxHP = Math.floor(this.maxHP * (lvl / 100 * this.hpQ * 2) + (this.maxHP / 100 * this.hpQ));
      this.hp = this.maxHP;

      this.def = this.def * (lvl / 100 * this.defQ) + (this.def / 100 * this.defQ);
    }

    reset() {
      this.update(1);
    }
  };
})();