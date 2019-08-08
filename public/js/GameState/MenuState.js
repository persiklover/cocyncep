var MenuState = (function() {

  var currentChoice = 0;
  var name = "___";
  var classNames = [
    "archer",
    "swordsman"
  ];

  var animations = [];

  function isValid(username) {
    return username.length >= 3;
  }

  return class MenuState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init() {
      this.gsm.setState(this.gsm.GAMESTATE, {
        name:      "admin",
        className: classNames[currentChoice]
      });

      animations = [
        animationList.archer,
        animationList.swordsman
      ];
    }

    handleInput() {}

    update() {
      if (animations[currentChoice]) {
        animations[currentChoice].update();
      }
    }

    render(ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);

      // Static bg
      // ...
      
      ctx.save();
      ctx.scale(scale, scale);
      // ctx.translate(-camera.x, -camera.y);

      var cx = WIDTH / 2;
      var cy = HEIGHT / 2;

      TextRenderer.render(ctx, classNames[currentChoice], cx, cy + 15);
      
      // Render selected character
      if (animations[currentChoice]) {
        animations[currentChoice].render(ctx, cx, cy);
      }
      
      // Render name
      TextRenderer.render(ctx, name, cx, cy + 45);

      ctx.restore();
    }

    keyDown(key) {
      var keyCode = key.keyCode;      

      // Enter
      if (keyCode == 13) {
        if (isValid(name)) {
          console.log(`${name} (${classNames[currentChoice]})`);
          this.gsm.setState(this.gsm.GAMESTATE, {
            username:  name,
            className: classNames[currentChoice]
          });
        }
        else {
          console.warn('Invalid name');
        }
      }

      // Prev character
      if (keyCode == 37) {
        if (--currentChoice < 0) {
          currentChoice = classNames.length - 1;
        }
      }
      // Next Character
      if (keyCode == 39) {
        if (++currentChoice > classNames.length - 1) {
          currentChoice = 0;
        }
      }
    }
    
    keyUp(key) {
      var keyCode = key.keyCode;
      switch (keyCode) {
        case 13: // enter
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
        case 20: // caps lock
        case 37: // left
        case 39: // right
          return;
        case 8: // backspace
          name = name.slice(0, -1);
          if (name.length == 0) {
            name = "";
          }
          break;
        default:
          if (name == "") {
            name = "";
          }
          name += key.key;
          console.log(key);
      }
    }

    click(e) {

    }

    rightClick(e) {
      e.preventDefault();
    }

    mouseMove(e) {

    }
  }
})();