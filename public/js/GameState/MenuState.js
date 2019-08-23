var MenuState = (function() {

  var currentChoice = 0;
  var name = "";
  var classNames = [
    "archer",
    "swordsman"
  ];
  var error = "";

  var colors = [
    "#00eaaa",
    "#ee25ee",
  ]

  var animations = [];

  return class MenuState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init() {
      this.gsm.setState(this.gsm.GAMESTATE, {
        username: "admin",
        className: classNames[0]
      });

      animations = [
        animationList.archer,
        animationList.swordsman
      ];

      io.on("s_nameValidation", (err = "") => {
        error = err.toLowerCase();
        
        if (error.length == 0) {
          this.gsm.setState(this.gsm.GAMESTATE, {
            username:  name,
            className: classNames[currentChoice]
          });
        }
        else {
          console.error(`Error: ${error}`);
        }
      });
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

      // Render selected character
      if (animations[currentChoice]) {
        animations[currentChoice].render(ctx, cx, cy);
      }

      // Proffesstion
      TextRenderer.render(ctx, `profession:`, cx, cy + 8, {
        scale: .75,
        opacity: .6
      });

      TextRenderer.render(ctx, `${classNames[currentChoice]}`, cx, cy + 17, {
        scale: 1.5,
        color: colors[currentChoice]
      });

      TextRenderer.render(ctx, `enter your name:`, cx, cy + 40, {
        scale: .75,
        opacity: .6
      });
      
      // Render name
      TextRenderer.render(ctx, name, cx, cy + 50, {
        textBaseline: "top",
        scale: 1.25
      });
      
      if (error) {
        TextRenderer.render(ctx, error, cx, cy + 65, {
          textBaseline: "top",
          color: "#FF0000"
        });
      }

      ctx.restore();
    }

    keyDown(key) {
      var keyCode = key.keyCode;      

      // Enter
      if (keyCode == 13) {
        io.emit("c_nameValidation", name);
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
      var entered = String.fromCharCode(key.which).toLowerCase();
      if (entered.match(/\w|\d/)) {
        name += entered;
      }
      
      var keyCode = key.keyCode;
      switch (keyCode) {
        case 8: // backspace
          if (key.ctrlKey) {
            name = "";
          }
          else {
            name = name.slice(0, -1);
          }
          break;
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