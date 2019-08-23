var GUI = (function() {

  var messages = [];

  var skillslotsTexture = Loader.loadImage("img/skills/skillslots.png");
  var skillIcons;
  var locked;

  return class {
    constructor(player) {
      this.player = player;
      skillIcons = Loader.loadImage(`img/skills/${player.className}.png`);
      locked = Loader.loadImage(`img/skills/locked.png`);

      this.startTime = Date.now();
    }

    log(msg = "") {
      messages.push(msg);
      this.startTime = Date.now();
    }

    update() {
      if (Date.now() - this.startTime > 5000) {
        messages.pop();
        this.startTime = Date.now();
      }
    }

    render(ctx = new CanvasRenderingContext2D) {
      var skillslotsX = WIDTH / 2 - skillslotsTexture.width / 2;
      var skillslotsY = HEIGHT / 2 + 50;

      for (var i = 0; i < 3; i++) {
        if (i < this.player.unlockedSkills) {
          // console.log('!');
          ctx.drawImage(
            skillIcons,
            23 * i,
            0,
            23,
            23,
            skillslotsX + (23 * i) + i + 1,
            skillslotsY + 1,
            23,
            23
          );
        }
        else {
          // empty skills
          ctx.drawImage(
            locked,
            skillslotsX + (23 * i) + i + 1,
            skillslotsY + 1
          );
        }
      }

      // Skill slots
      ctx.drawImage(
        skillslotsTexture,
        skillslotsX,
        skillslotsY
      );

      
      // Display all the messages
      // for (var i = 0; i < messages.length; i++) {
      //   var msg = messages[i];

      //   TextRenderer.render(
      //     ctx,
      //     msg,
      //     3,
      //     HEIGHT - 10 - i * 8,
      //     {
      //       textAlign: "left",
      //       color: "rgb(255, 0, 0)"
      //     }
      //   );
      // }
    }
  }
})();