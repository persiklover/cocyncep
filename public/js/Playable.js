class Playable extends Entity {
  constructor(x = 0, y = 0) {
    super(x, y);

    this.dx = 0;
    this.dy = 0;

    this._minSpeed  = .85;
    this._maxSpeed  = 1.35;
    this._stopSpeed = 1;
  }

  pack() {
    return {
      x:            this.x,
      y:            this.y,
      facingRight:  this.facingRight,
      currentState: this.currentState,
    };
  }

  preformAttack() {
    if (!this.attacking) {
      this.attacking = true;

      this.currentState = 'ATTACK';
      this.anim.play(this.states.indexOf('ATTACK'), () => {
        // Send data to server here
        var packet = {
          className:    this.className,
          x:            this.x,
          y:            this.y,
          facingRight:  this.facingRight,
          currentState: this.currentState
        };
        io.emit('attack', packet);
        
        this.anim.pause();
        setTimeout(() => {
          this.attacking = false;
          this.currentState = 'IDLE';
          this.anim.resume();
          this.anim.play(0);
        }, 150);
      });
      return true;
    }
    return false;
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