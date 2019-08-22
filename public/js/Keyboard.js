var Keyboard = {
  keys: [],

  LEFT:   37,
  UP:     38,
  RIGHT:  39,
  DOWN:   40,

  A:      65,
  W:      87,
  S:      83,
  D:      68,
  E:      69,
  R:      82,
  F:      70,
  Z:      90,
  C:      67,
  v:      86,

  1:      49,
  2:      50,
  3:      51,

  ENTER:  13,
  ESCAPE: 27,
  SPACE:  32,
  CTRL:   17,
  DELETE: 46,

  keyDown(keyCode) {
    this.keys[keyCode] = true;
  },

  keyUp(keyCode) {
    this.keys[keyCode] = false;
  },

  isPressed(keys = []) {
    return [].concat(keys).every(key => this.keys[key]);
  }
};