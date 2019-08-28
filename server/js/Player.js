var Player = (function() {
  
  return class {
    constructor(id = "", name = "", prof = "", pos = new Vec2) {
      this.id    = id;
      this.name  = name;
      this.prof  = prof;
      this.pos   = pos;

      this.dx = 0;
      this.dy = 0;

      this.lvl        = 1;
      this.xp         = 0;
      this.xpRequired = 10;

      this.startTime = Date.now();
      
      this.stats = new Stats(prof, this.lvl);
    }

    update() {
      if (Date.now() - this.startTime > 1000) {
        this.stats.addHP(this.stats.hpRegen);
        this.startTime = Date.now();
      }
      
      this.pos.x += this.dx;
      this.pos.y += this.dy;
    }

    isDead() { return this.stats.hp <= 0; }

    dealDamage(damage = 0) {
      damage = Math.round(damage - (damage / 100 * this.stats.def));
      this.stats.hp -= damage;
      if (this.stats.hp < 0) {
        this.stats.hp = 0;
      }

      return damage;
    }

    reborn() {
      this.stats.reset();
    }

    addXP(xp) {
      this.xp += xp;
      if (this.xp >= this.xpRequired) {
        this.levelUp();
      }
    }

    levelUp() {
      this.lvl++;
      this.stats.update();
    }

    merge(obj) {
      for (let key in obj) {
        if (!this.hasOwnProperty(key)) {
          this[key] = obj[key];
        }
      }
    }
  }
})();