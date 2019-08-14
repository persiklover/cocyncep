var GameState = (function () {

  var camera = new Camera();

  var mouse = {
    x: 0,
    y: 0,
    localX: 0,
    localY: 0,

    get x() { return this.localX + camera.x; },
    get y() { return this.localY + camera.y; }
  };

  var _moved         = false;
  var _movedPrev     = false;
  var _stoppedMoving = false;
  var player;
  // Sprites
  var floor;

  // Map
  var mapWidth;
  var mapHeight;

  var gameObjects = [];

  var players = [];
  var sprites = [];
  var mobs = [];
  var spells = [];

  var gui;

  var cursorImg = Loader.loadImage('img/cursor.png');

  function addDebil(x, y, className, name, id) {
    var debil = new FakePlayer(
      x,
      y,
      className,
      name
    );

    players[id] = debil;
  }

  return class GameState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init(args) {
      player = new Player(50, 50, (Math.random() > 0.5) ? "swordsman" : "archer", args.username);
      console.log(player.name);

      gui = new GUI(player);

      // Sprites
      floor = new Sprite(Loader.loadImage('img/map.png'), 0, 0);

      // Sprites
      sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 15, 40,   { x: 6, y: 9 }));
      sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 220, 120, { x: 6, y: 9 }));

      mobs.push(new AnimatedObject(250, 100, new Animation(
        Loader.loadImage(`img/crab.png`),
        [2, 2],      // imagesNum
        [3500, 120],  // delays
        [31, 13],    // sizes
        { x: 15, y: 13 }
      )).setAnimation(1));

      setInterval(function() {
        if (_moved) {
          io.emit('c_update', {
            x:            player.x,
            y:            player.y,
            facingRight:  player.facingRight,
            currentState: player.currentState
          });
        }
        if (_stoppedMoving) {
          _stoppedMoving = false;
          io.emit('c_rest', null);
        }
      }, 40);
    }

    handleInput() {
      _moved = false;

      if (Keyboard.isPressed(Keyboard.A)) {
        player.left();
        _moved = true;
      }
      else if (Keyboard.isPressed(Keyboard.D)) {
        player.right();
        _moved = true;
      }
      else {
        player.stopX();
      }

      if (Keyboard.isPressed(Keyboard.W)) {
        player.up();
        _moved = true;
      }
      else if (Keyboard.isPressed(Keyboard.S)) {
        player.down();
        _moved = true;
      }
      else {
        player.stopY();
      }

      if (!_moved) {
        // player.stop();
        if (_movedPrev) {
          _stoppedMoving = true;
        }
      }

      _movedPrev = _moved;
    }

    update() {
      var facingDirectionBefore = player.facingDirection;
      player.facingDirection = new Vec2(mouse.x, mouse.y)
        .sub(new Vec2(player.x, player.y))
        .normalize();
      player.update();

      if ((facingDirectionBefore.x > 0 && player.facingDirection.x < 0) ||
          (facingDirectionBefore.x < 0 && player.facingDirection.x > 0)) {
        io.emit('c_changedDir');
      }

      camera.x = player.x - WIDTH / 2;
      camera.y = player.y - HEIGHT / 2;

      if (camera.x < 0) {
        camera.x = 0;
      }
      if (camera.y < 0) {
        camera.y = 0;
      }

      for (var key of Object.keys(players)) {
        var p = players[key];
        p.update(ctx);
      }

      for (var mob of mobs) {
        mob.update();
      }

      gui.update();
    }

    render(ctx = new CanvasRenderingContext2D) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.x, -camera.y);

      floor.render(ctx);

      // Show direction
      // ctx.save();
      // ctx.translate(
      //   player.x,
      //   player.y
      // );
      // var angle = new Vec2(player.x, player.y)
      //   .sub(new Vec2(mouse.x, mouse.y))
      //   .direction() + 90;
      // ctx.rotate(Math.toRadian(angle));
      // ctx.globalAlpha = .75;
      // ctx.drawImage(cursorImg, - cursorImg.width / 2, - 8);
      // ctx.restore();

      var toDraw = []
        .concat(sprites)
        .concat(mobs)
        .concat(player);
      
      for (var key of Object.keys(players)) {
        var p = players[key];
        toDraw.push(p);
      }

      // sorting
      toDraw.sort((l, r) => l.y - r.y);
      // console.log(toDraw);

      for (var i = 0; i < toDraw.length; i++) {
        toDraw[i].render(ctx);
      }

      TextRenderer.render(
        ctx,
        player.name,
        player.x,
        player.y - player.anim.height - 5,
        {
          color: "#FFAAEE"
        }
      );

      ctx.restore();
      
      // GUI
      ctx.save();

      ctx.scale(scale, scale);
      
      // gui.render(ctx);
      
      ctx.restore();
    }

    keyDown(key) {
      var keyCode = key.keyCode;
      Keyboard.keyDown(keyCode);
    }
    
    keyUp(key) {
      var keyCode = key.keyCode;
      Keyboard.keyUp(keyCode);

      if (keyCode == 70) {
        addDebil(Math.randomInt(0, 100), Math.randomInt(0, 100), "swordsman", "de_bil");
      }
    }

    mouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.localX = (e.clientX - rect.left) / scale;
      mouse.localY = (e.clientY - rect.top)  / scale;
    }

    click(e) {
      // actor.preformAttack();
      _moved = true;
    }
    
    rightClick(e) {
      e.preventDefault();
    }
  }
})();