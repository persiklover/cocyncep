class Playable extends Entity {
  constructor(x = 0, y = 0) {
    super(x, y);

    this.dx = 0;
    this.dy = 0;

    this._minSpeed  = .85;
    this._maxSpeed  = 1.35;
    this._stopSpeed = 1;

    this._prevAttackTime = 0;
  }

  pack() {
    return {
      x:            this.x,
      y:            this.y,
      facingRight:  this.facingRight,
      currentState: this.currentState,
    };
  }

  canAttack() {
    var elapsed = Date.now() - this._prevAttackTime;
    if (elapsed > 400) {
      this._prevAttackTime = Date.now();
      return true;
    }

    return false;
  }

  attack(index = 0, cb = function() {}) {
    if (!this.attacking) {
      this.attacking = true;

      this.rooted = true;

      this.currentState = index;
      this.anim.play(this.currentState, () => {
        cb();
        
        this.anim.pause();
        setTimeout(() => {
          this.rooted = false;

          this.attacking = false;
          this.currentState = this.states.IDLE;
          this.anim.resume();
          this.anim.play(0);
        }, 150);
      });
      return true;
    }
    return false;
  }

  root() {
    this.rooted = true;
    this.dx = this.dy = 0;
  }

  left() {
    if (this.dx > -this._minSpeed) {
      this.dx = -this._minSpeed;
    }
    this.dx -= .05;
    if (this.dx < -this._maxSpeed) {
      this.dx = -this._maxSpeed;
    }
  }

  right() {
    if (this.dx < this._minSpeed) {
      this.dx = this._minSpeed;
    }
    this.dx += .05;
    if (this.dx > this._maxSpeed) {
      this.dx = this._maxSpeed;
    }
  }

  up() {
    if (this.dy > -this._minSpeed) {
      this.dy = -this._minSpeed;
    }
    this.dy -= .05;
    if (this.dy < -this._maxSpeed) {
      this.dy = -this._maxSpeed;
    }
  }

  down() {
    if (this.dy < this._minSpeed) {
      this.dy = this._minSpeed;
    }
    this.dy += .05;
    if (this.dy > this._maxSpeed) {
      this.dy = this._maxSpeed;
    }
  }

  stopX() {
    if (this.dx > 0) {
      this.dx -= this._stopSpeed;
      if (this.dx < 0) {
        this.dx = 0;
      }
    }
    else if (this.dx < 0) {
      this.dx += this._stopSpeed;
      if (this.dx > 0) {
        this.dx = 0;
      }
    }
  }

  stopY() {
    if (this.dy > 0) {
      this.dy -= this._stopSpeed;
      if (this.dy < 0) {
        this.dy = 0;
      }
    }
    else if (this.dy < 0) {
      this.dy += this._stopSpeed;
      if (this.dy > 0) {
        this.dy = 0;
      }
    }
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
}