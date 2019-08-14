var TextRenderer = (function() {

  const letters = {
    "1": { x: 0,   y: 17, w: 3, h: 7 },
    "2": { x: 4,   y: 17, w: 5, h: 7 },
    "3": { x: 10,  y: 17, w: 5, h: 7 },
    "4": { x: 16,  y: 17, w: 5, h: 7 },
    "5": { x: 22,  y: 17, w: 5, h: 7 },
    "6": { x: 28,  y: 17, w: 5, h: 7 },
    "7": { x: 34,  y: 17, w: 5, h: 7 },
    "8": { x: 40,  y: 17, w: 5, h: 7 },
    "9": { x: 46,  y: 17, w: 5, h: 7 },
    "0": { x: 52,  y: 17, w: 5, h: 7 },

    "?": { x: 0,   y: 9,   w: 5, h: 7 },
    "?": { x: 6,   y: 9,   w: 1, h: 7 },
    ":": { x: 82,  y: 10,  w: 1, h: 5, t: 2 },
    "<": { x: 24,  y: 8,   w: 4, h: 8 },
    ">": { x: 29,  y: 8,   w: 4, h: 8 },
    "/": { x: 61,  y: 8,   w: 6, h: 8 },
    "_": { x: 84,  y: 15,  w: 5, h: 1, t: 7 },
    "-": { x: 44,  y: 12,  w: 4, h: 1, t: 4 },
    ".": { x: 77,  y: 15,  w: 1, h: 1, t: 6 },
    ",": { x: 79,  y: 14,  w: 2, h: 2, t: 5 },

    "a": { x: 0,   y: 1,  w: 5, h: 6, t: 1 },
    "b": { x: 6,   y: 0,  w: 5, h: 7 },
    "c": { x: 12,  y: 1,  w: 5, h: 6, t: 1 },
    "d": { x: 18,  y: 0,  w: 5, h: 7 },
    "e": { x: 24,  y: 1,  w: 5, h: 6, t: 1 },
    "f": { x: 30,  y: 0,  w: 4, h: 7 },
    "g": { x: 35,  y: 1,  w: 5, h: 6, t: 1 },
    "h": { x: 41,  y: 0,  w: 5, h: 7 },
    "i": { x: 47,  y: 0,  w: 3, h: 7 },
    "j": { x: 51,  y: 0,  w: 2, h: 7 },
    "k": { x: 54,  y: 0,  w: 5, h: 7 },
    "l": { x: 60,  y: 0,  w: 3, h: 7 },
    "m": { x: 64,  y: 1,  w: 5, h: 6, t: 1 },
    "n": { x: 70,  y: 1,  w: 5, h: 6, t: 1 },
    "o": { x: 76,  y: 1,  w: 5, h: 6, t: 1 },
    "p": { x: 82,  y: 1,  w: 5, h: 6, t: 1 },
    "q": { x: 88,  y: 1,  w: 5, h: 6, t: 1 },
    "r": { x: 94,  y: 1,  w: 5, h: 6, t: 1 },
    "s": { x: 100, y: 1,  w: 5, h: 6, t: 1 },
    "t": { x: 106, y: 0,  w: 4, h: 7 },
    "u": { x: 111, y: 1,  w: 5, h: 6, t: 1 },
    "v": { x: 117, y: 1,  w: 5, h: 6, t: 1 },
    "w": { x: 123, y: 1,  w: 5, h: 6, t: 1 },
    "x": { x: 129, y: 1,  w: 5, h: 6, t: 1 },
    "y": { x: 135, y: 1,  w: 5, h: 6, t: 1 },
    "z": { x: 141, y: 1,  w: 5, h: 6, t: 1 }
  };

  var fontImg = Loader.loadImage('img/font.png', () => {
    console.warn("loaded");
    fontImg.ready = true;
  });

  function calculateWidth(data = "", settings = {}) {
    var width = 0;

    for (var char of data) {
      if (letters[char]) {
        var charData = letters[char];
        width += charData.w + settings.letterSpacing;
      }
      else if (char == " ") {
        width += settings.wordSpacing;
      }
    }

    return width;
  }
  
  function calculateHeight(data = "", settings = {}) {
    var maxHeight = 0;

    for (var char of data) {
      if (letters[char]) {
        var charData = letters[char];
        if (charData.h > maxHeight) {
          maxHeight = charData.h;
        }
      }
    }

    return maxHeight;
  }

  return {
    render(ctx = new CanvasRenderingContext2D, data = "", x = 0, y = 0, settings = {}) {
      if (!fontImg.ready) {
        console.log("exiting");
        return;
      }

      settings.fontSize      = settings.fontSize      || 11;
      settings.letterSpacing = settings.letterSpacing || 1.2;
      settings.wordSpacing   = settings.wordSpacing   || 4;
      settings.textAlign     = settings.textAlign     || "center";
      settings.textBaseline  = settings.textBaseline  || "center";
      settings.scale         = settings.scale         || settings.fontSize / 11;
      settings.opacity       = settings.opacity       || 1;
      settings.color         = settings.color         || "rgb(0,0,0)";

      var width  = calculateWidth(data, settings);
      var height = calculateHeight(data, settings);

      var nextX = 0;

      ctx2.save();

      ctx2.translate(x, y);
      if (settings.textAlign == 'center') {
        ctx2.translate(- (width * settings.scale) / 2, 0);
      }

      if (settings.textBaseline == 'top') {

      }
      else if (settings.textBaseline == 'center') {
        ctx2.translate(0, - (height * settings.scale) / 2);
      }
      ctx2.scale(settings.scale, settings.scale);

      for (var char of data) {
        if (char == " ") {
          nextX += settings.wordSpacing;
        }
        else {
          var charData = letters[char];
          if (!charData) {
            charData = letters["?"];
          }

          ctx2.drawImage(
            fontImg,
            charData.x,
            charData.y,
            charData.w,
            charData.h,
            (charData.l != null) ? nextX + charData.l : nextX,
            (charData.t != null) ? 0 + charData.t : 0,
            charData.w,
            charData.h
          );
          nextX += (charData.w + settings.letterSpacing); 
        }
      }
      
      if (settings.color) {
        var colorData = parseColor(settings.color);

        var dx = x - (width / 2)  * scale * settings.scale;
        var dy = y - (height / 2) * scale * settings.scale;
        var dw = width  * scale * settings.scale + 1;
        var dh = height * scale * settings.scale + 1;

        // var dy = (function() {
        //   switch(settings.textBaseline) {
        //     case "top":
        //       return y * scale * settings.scale;
        //     case "center": 
        //       return y * scale - (height / 2) * scale * settings.scale;
        //   }
        // })();

        var imageData = ctx2.getImageData(
          dx,
          dy,
          dw,
          dh
        );
        var pixels = imageData.data;

        for (var i = 0; i < pixels.length; i += 4) {
          if (pixels[i+3] != 0) {
            pixels[i]   = colorData[0]; //red
            pixels[i+1] = colorData[1]; //green
            pixels[i+2] = colorData[2]; //blue
          }
        }
        ctx2.putImageData(imageData, dx, dy);
      }
      ctx2.restore();
      
      ctx.drawImage(canvas2, 0, 0);
    }
  };
})();