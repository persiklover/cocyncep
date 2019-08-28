function randomInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toRadian(angle) {
  return angle * (Math.PI / 180);
}

function toDegrees(angle) {
  return angle * (180 / Math.PI);
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) {
    return obj;
  }
  var copy = obj.constructor();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}