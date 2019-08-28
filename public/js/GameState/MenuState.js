var MenuState = (function() {

  var currentChoice = 0;
  var name = "";
  var profsList = [
    "archer",
    "scientist"
  ];
  var error = "";

  var colors = [
    "#00eaaa",
    "#ee25ee",
  ];

  var sprites = [];
  var animations = [];

  return class MenuState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init() {
      // this.gsm.setState(this.gsm.GAMESTATE, {
      //   prof: "scientist",
      //   name: "admin"
      // });

      animations = [
        animationList.archer,
        animationList.scientist,
      ];

      for (let i = 0; i < profsList.length; i++) {
        let prof = profsList[i];

        let sprite = new Sprite(texturesList[prof], WIDTH / 2 + (60 * i), HEIGHT / 2);
        animationList[prof].bind(sprite).setIndex(1);

        sprites.push(sprite);
      }

      io.on("s_nameValidation", (err = "") => {
        error = err.toLowerCase();
        
        if (error.length == 0) {
          this.gsm.setState(this.gsm.GAMESTATE, {
            prof: profsList[currentChoice],
            name: name
          });
        }
        else {
          console.error(`Error: ${error}`);
        }
      });
    }

    handleInput() {}

    update() {
      for (var anim of animations) {
        anim.update();
      }
    }

    render(ctx = new CanvasRenderingContext2D) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);
      
      ctx.save();
      ctx.scale(scale, scale);

      ctx.save();
      ctx.translate(-60 * currentChoice, 0);

      var cx = WIDTH / 2;
      var cy = HEIGHT / 2;

      // Render selected character
      for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];

        var filter = null;
        if (i != currentChoice) {
          filter = Filter.SHADOW;
        }
        sprite.render(ctx, {}, filter);
      }

      ctx.restore();

      // Proffesstion
      TextRenderer.render(ctx, `profession:`, cx, cy + 8, {
        scale: .75,
        opacity: .6
      });

      TextRenderer.render(ctx, `${profsList[currentChoice]}`, cx, cy + 17, {
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
          currentChoice = animations.length - 1;
        }
      }
      // Next Character
      if (keyCode == 39) {
        if (++currentChoice > animations.length - 1) {
          currentChoice = 0;
        }
      }
    }
    
    keyUp(key) {
      var keyCode = key.keyCode;
      switch (keyCode) {
        case 189:
          if (key.shiftKey) {
            name += "_"
          }
          else {
            name += "-"
          }
          return;
        case 8: // backspace
          if (key.ctrlKey) {
            name = "";
          }
          else {
            name = name.slice(0, -1);
          }
          break;
      }

      var entered = String.fromCharCode(key.which).toLowerCase();
      console.log(key.keyCode);
      if (entered.match(/\w|\d/)) {
        name += entered;
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