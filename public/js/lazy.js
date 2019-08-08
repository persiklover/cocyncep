'use strict';

function speedTest(func) {
  let t = Date.now();
  func();
  return (Date.now() - t).toFixed(4)+'ms';
}

// =========
// String
// =========
String.prototype.replaceAll = ''.replaceAll || function(search, replacement) {
  return this.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.startsWith = ''.startsWith || function(search) {
  return search == this.substring(0, search.length);
};

String.prototype.endsWith = ''.endsWith || function(search) {
  return search == this.slice(-search.length);
};

function format(num, len) {
  return '0'.repeat(Math.max(0, len - num.length)) + num;
}

// String.prototype.random = function(length, chars) {
//   var i, j, lettets, ref, res;
//   if (length == null) {
//     length = 5;
//   }
//   res = '';
//   lettets = chars || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
//     res += lettets.charAt(Math.floor(Math.random() * lettets.length));
//   }
//   return res;
// };

Array.prototype.copy = [].copy || function() {
  return this.slice();
};

Array.prototype.remove = [].remove || function(element) {
  var index = this.indexOf(element);
  if (index > -1) {
    this.splice(index, 1);
  }
};

Array.prototype.random = [].random || function() {
  return this[Math.floor(Math.random() * this.length)];
};

// ===============
// Math
// ===============
Math.toRadian = Math.toRadian || function(angle) {
  return angle * (Math.PI / 180);
};

Math.toDegrees = Math.toDegrees || function(angle) {
  return angle * (180 / Math.PI);
};

Math.randomInt = Math.randomInt || function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

Math.randomBoolean = Math.randomBoolean || function () {
  return Math.random() >= 0.5;
};

Number.prototype.getDecimal = function() {
  return this > 0 ? this - this^0 : Math.ceil(this) - this;
}

function getDecimal(num) {
  return (num > 0 )? num - (num^0) : Math.ceil(num) - num;
}





function readFile(url) {
  var src = '';
  var req = new XMLHttpRequest;
  req.open('GET', url, false);
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200 || req.status == 0) {
        src = req.responseText;
      }
    }
  };
  req.send();
  return src;
};

function require(url, onload = function() {}) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = onload;
  document.body.appendChild(script);
};