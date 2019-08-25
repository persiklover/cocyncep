var GUI = (function() {

  var messages = [];

  var skillslotsTexture = Loader.loadImage("img/skills/skillslots.png");
  var skillIcons;
  var locked;

  function renderBar(ctx, x = 0, y = 0, w = 0, h = 0, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w + .5, h + .5);
  }

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
      ctx.save();
      ctx.translate(10.5, 10.5);

      TextRenderer.render(ctx, `lvl ${this.player.lvl}`, 0, 0, {
        textAlign: "left"
      });

      var nextY = 10;
      // Health bar
      renderBar(ctx, 0, nextY, 65, 6, "lightgray");
      
      if (this.player.hp > 0) {
        var persentage = (this.player.hp / this.player.maxHP);
        var color = persentage > .66 ? "lime" : persentage > .33 ? "orange" : "red";
        renderBar(ctx, 0, nextY, 65 * persentage, 6, color);
      }

      TextRenderer.render(ctx, `${this.player.hp}/${this.player.maxHP}`, 65 / 2, nextY + .5, {
        scale: .75
      });

      nextY += 10;

      // XP bar
      renderBar(ctx, 0, nextY, 65, 6, "lightgray");

      if (this.player.xp > 0) {
        var persentage = (this.player.xp / this.player.xpRequired);
        renderBar(ctx, 0, nextY, 65 * persentage, 6, "hotpink");
      }

      TextRenderer.render(ctx, `${this.player.xp}/${this.player.xpRequired}`, 65 / 2, nextY + .5, {
        scale: .75
      });

      ctx.restore();

      return;

      // Skills
      var skillslotsX = WIDTH / 2 - skillslotsTexture.width / 2;
      var skillslotsY = HEIGHT - 50;

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