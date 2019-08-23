var Vec2 = class {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    var len = this.length();
    this.x /= len;
    this.y /= len;
    return this;
  }

  add(v = new Vec2()) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v = new Vec2()) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  mul(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  distance(v = new Vec2()) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
  }

  toAngle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(a, ox = 0, oy = 0) {
    this.x -= ox;
    this.y -= oy;
    this.x = this.x * Math.cos(a) - this.y * Math.sin(a);
    this.y = this.x * Math.sin(a) + this.y * Math.cos(a);
    this.x += ox;
    this.y += oy;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  fromArray(arr = []) {
    this.x = arr[0];
    this.y = arr[1];
    return this;
  }

  toArray() {
    return [this.x, this.y];
  }
  
  toString() {
    return `{${this.x.toFixed(4)}; ${this.y.toFixed(4)}}`;
  }
}