var Player = (function() {
  
  return class Player {
    constructor(id, name, className, pos) {
      this.id        = id;
      this.name      = name;
      this.className = className;
      this.pos       = pos;

      // Stats
      // this.stats = new Stats();
      this.hp = 10;
      this.def = 5;
      
      switch (className) {
        case 'swordsman':
          this.hp = 16;
          this.def = 15;
          break;
          case 'archer':
          this.hp = 10;
          break;
      }

      this.maxHP = this.hp;

      this.lvl = 1;
      this.xp = 0;
      this.xpRequired = 10;
    }

    dealDamage(damage) {
      damage -= (damage / 100 * this.def);
      this.hp -= damage;
      if (this.hp < 0) {
        this.hp = 0;
      }
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

    reset() {
      console.log('reset');
      
      this.lvl        = 1;
      this.hp         = 10;
      this.xp         = 0;
      this.xpRequired = 10;
      this.pos.x      = 50;
      this.pos.y      = 50;

      io.to(this.id).emit('_dead', {
        hp:         this.hp,
        x:          this.pos.x,
        y:          this.pos.y,
        xpRequired: this.xpRequired
      });
      var socket = io.sockets.connected[this.id];
      socket.broadcast.emit('update', {
        id:           this.id,
        x:            this.pos.x,
        y:            this.pos.y,
        currentState: this.currentState,
        facingRight:  this.facingRight
      });
    }
  }
})();