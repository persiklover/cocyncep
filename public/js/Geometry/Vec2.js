class Vec2 {
  constructor(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(v) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  scale(f) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  normalize() {
    var len = this.length();
    if (len > 0) {
      this.scale(1 / len);
    }
    return this;
  }

  abs() {
    this.x = (this.x < 0) ? -this.x : this.x;
    this.y = (this.y < 0) ? -this.y : this.y;
    return this;
  }

  direction() {
    var rad = Math.atan2(this.y, this.x);
    var deg = rad * 180 / Math.PI;
    if (deg < 0)
      deg = 360 + deg;
    return deg;
  }

  toString() {
    return `{${this.x.toFixed(4)}; ${this.y.toFixed(4)}}`;
  }
}






