var Loader = (function() {

  var loadedImages = [];

  return class {
    static loadImage(url="", onload=function(){}) {
      if (loadedImages[url]) {
        return loadedImages[url];
      }
      
      var img = new Image();
      img.src = url;
      img.onload = function() {
        onload(img);
      };
      loadedImages[url] = img;
      return img;
    }
  }
})();