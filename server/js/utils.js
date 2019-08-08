function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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