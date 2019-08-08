var Mob = class Mob {
  constructor(x = 0, y = 0) {
    this.pos   = new Vec2(x, y);
    this.delta = new Vec2();

    this.lvl   = 0;
    this.hp    = 0;
    this.maxHP = this.hp;
    this.speed = 0;

    this.currentState = 'IDLE';
    this.facingRight = true;

    this.playerToFollow = null;
    this.hasPlayerToFollow = false;

    // Flags
    this.moved = false;
    this.reachedDest = false;
    this.following = false;
  }

  setDestination(dest = new Vec2(), range = 0, cb = function () {}) {
    this.dest = dest;
    this.destCb = cb;
    this.destRange = range;
    this.delta = this.dest.clone()
      .sub(this.pos)
      .normalize()
      .mul(this.speed);
  }

  attack(player, range = 0, cb = function () {}) {
    this.following = true;
    this.attackAllowed = true;
    if (this.restInterval) {
      clearTimeout(this.restInterval);
    }
    this.setDestination(player.pos, range, cb);
  }

  update() {
    if (this.dest) {
      // Reached destination
      if (this.pos.distance(this.dest) <= (this.speed + this.destRange)) {
        this.reachedDest = true;

        if (this.playerToFollow) {
          var player = this.playerToFollow;
          
          // Check if player is already dead
          if (player.hp <= 0 || player._disconnected) {
            this.playerToFollow = null;
            this.hasPlayerToFollow = false;
            this.following = false;
            setTimeout(() => {
              this.changeDestination();
            }, 1000);
            return;
          }

          if (this.attackAllowed) {
            // Stop mob for 1sec
            this.stopped = true;
            setTimeout(() => {
              this.stopped = false;
            }, 1000);
            
            this.attackAllowed = false;
            setTimeout(() => {
              io.sockets.emit('mob_attack', {
                id:    this.id,
                delay: this.attackDelay
              });
              setTimeout(() => {
                player.dealDamage(this.damage);
                if (player.hp > 0) {
                  io.to(player.id).emit('_damage', player.hp);
                }
                else {
                  player.reset();

                  this.playerToFollow = null;
                  this.hasPlayerToFollow = false;
                  this.following = false;
                  setTimeout(() => {
                    this.changeDestination();
                  }, 1000);
                  return;
                }

                setTimeout(() => {
                  this.attackAllowed = true;
                }, this.attackInterval);
              }, 350);
            }, this.attackDelay);
          }
        }
        else {
          this.dest = null;
          this.delta = new Vec2();
        }

        if (this.destCb) {
          this.destCb();
          this.destCb = null;
        }
      }
      else {
        this.reachedDest = false;

        if (this.hasPlayerToFollow && this.playerToFollow._disconnected) {
          this.playerToFollow = null;
          this.hasPlayerToFollow = false;
          this.following = false;

          this.stopped = true;
          setTimeout(() => {
            this.stopped = false;
            this.changeDestination();
          }, 1000);
          return;
        }
      }
    }

    if (this.delta.x > 0) {
      this.facingRight = true;
    }
    else if (this.delta.x < 0) {
      this.facingRight = false;
    }

    if (this.dest && this.following) {
      this.delta = this.dest.clone()
        .sub(this.pos)
        .normalize()
        .mul(this.speed);
    }
    if (!(this.reachedDest || this.stopped)) {
      this.pos.add(this.delta);
    }
    this.moved = this.delta.x || this.delta.y;
  }

  dealAttack(initiator) {
    this.playerToFollow = initiator;
    this.hasPlayerToFollow = true;
    // todo: behavior based on `agressiveness`?
    this.attack(initiator, this.attackRange);
  }

  dealDamage(damage = 0) {
    this.hp -= damage;
    if (this.hp < 0) {
      this.hp = 0;
    }
  }

  // Getters
  isDead() { return this.hp <= 0; }
}