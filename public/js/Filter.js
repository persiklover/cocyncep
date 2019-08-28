var Filter = {

  SHADOW: function(r, g, b, a) {
    r -= 175;
    if (r < 0) { r = 0; }
    g -= 175;
    if (g < 0) { g = 0; }
    b -= 175;
    if (b < 0) { b = 0; }

    return [r, g, b, a];
  }
}