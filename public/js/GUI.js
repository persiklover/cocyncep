var GUI = (function() {

  var messages = [];

  return class {
    constructor(player) {
      this.player = player;

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

    render(ctx) {
      TextRenderer.render(
        ctx,
        `x: ${this.player.x.toFixed(4)}, y: ${this.player.y.toFixed(4)}`,
        this.player.x,
        this.player.y,
        {
          textAlign: "left"
        }
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