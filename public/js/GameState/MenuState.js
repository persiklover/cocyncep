var MenuState = (function() {

  var currentChoice = 0;
  var name = "";
  var classNames = [
    "archer",
    "swordsman"
  ];
  var error = "name is too short";

  var colors = [
    "rgb(10, 160, 90)",
    "rgb(255, 10, 60)",
  ]

  var animations = [];

  var bgTexture = Loader.loadImage("img/map.png");

  function isValid(username) {
    return username.length >= 3;
  }

  return class MenuState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init() {
      // this.gsm.setState(this.gsm.GAMESTATE, {
      //   name:      "admin",
      //   className: classNames[currentChoice]
      // });

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

    render(ctx = new CanvasRenderingContext2D) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);
      
      ctx.save();
      ctx.scale(scale, scale);

      var cx = WIDTH / 2;
      var cy = HEIGHT / 2;

      // Proffesstion
      TextRenderer.render(ctx, `profession:`, cx, cy + 8, {
        scale: .75,
        opacity: .6
      });
      TextRenderer.render(ctx, `${classNames[currentChoice]}`, cx, cy + 17, {
        scale: 1.5,
        color: colors[currentChoice]
      });
      
      // Render selected character
      if (animations[currentChoice]) {
        animations[currentChoice].render(ctx, cx, cy);
      }

      // 
      TextRenderer.render(ctx, `enter your name:`, cx, cy + 40, {
        scale: .75,
        opacity: .6
      });
      
      // Render name
      TextRenderer.render(ctx, name, cx, cy + 45, {
        textBaseline: "top"
      });
      
      if (error) {
        TextRenderer.render(ctx, error, cx, cy + 55, {
          textBaseline: "top",
          color: "rgb(255, 0, 0)"
        });
      }

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