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

  function connect() {
    io = io();

    // c_ -> sent from client
    // s_ -> sent from server
    io.emit('c_enter', {
      name:         player.name,
      className:    player.className,
      x:            player.x,
      y:            player.y,
      facingRight:  player.facingRight,
      currentState: player.currentState
    });

    io.on('s_enter', function (playerData) {
      console.log(`Someone just entered! Here's his data:`);
      console.log(playerData);

      addDebil(playerData.x, playerData.y, playerData.className, playerData.name, playerData.id);
    });

    io.on('s_update', function (playerData) {
      
      var p = players[playerData.id];
      p.x            = playerData.x;
      p.y            = playerData.y;
      p.facingDirection.x = (playerData.facingRight) ? 1 : -1;
      p.currentState = playerData.currentState;
    });

    io.on('_leave', function (id) {
      // todo: remove
      players[id] = null;
    });

    io.on('s_hello', function (packet) {
      console.log(packet);

      // var map = packet.map;

      // map.sprites.forEach(function (sData) {
      //   var img = Loader.loadImage(sData.url);
      //   var sprite = new Sprite(img, sData.x, sData.y, sData.offset);
      //   sprites.push(sprite);
      // });

      // map.mobs.forEach(function (mData) {
      //   var mob;
      //   switch (mData.type) {
      //     case 'peach':
      //       mob = new MobPeach(mData.x, mData.y);
      //       break;
      //   }
      //   mob.hp = mData.hp;
      //   mob.maxHP = mData.maxHP;
      //   mobs[mData.id] = mob;
      // });

      var players = packet.players;
      for (var key of Object.keys(players)) {
        var playerData = players[key];

        addDebil(playerData.pos.x, playerData.pos.y, playerData.className, playerData.name, playerData.id);
      }

      // var me = packet.me;
      // player.hp    = me.hp;
      // player.maxHP = me.maxHP;
      // player.x     = me.x;
      // player.y     = me.y;
    });
  }

  function addDebil(x, y, className, name, id) {
    console.log(arguments);

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
      player = new Player(0, 0, args.className, args.name);

      connect();

      gui = new GUI(player);

      // Sprites
      floor = new Sprite(Loader.loadImage('img/map.png'), 0, 0);

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
          io.emit('rest', null);
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
      player.facingDirection = new Vec2(mouse.x, mouse.y)
        .sub(new Vec2(player.x, player.y))
        .normalize();
      player.update();

      camera.x = player.x - WIDTH / 2;
      camera.y = player.y - HEIGHT / 2;

      for (var key of Object.keys(players)) {
        var p = players[key];
        p.update(ctx);
        console.log(p.facingDirection.x);
      }
    }

    render(ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.x, -camera.y);

      // Render floor
      ctx.save();
      ctx.globalAlpha = .7;
      const TILE_SIZE = 64;
      var letters = "abcdefgh";
      var rows = letters.length;
      var r = 150;
      var g = 10;
      var b = 90;
      for (var i = 0; i < letters.length; i++) {
        for (var j = 0; j < rows; j++) {
          r += 40;
          g += 20;
          b += 100;
          if (r > 255) { r = 0; }
          if (g > 255) { g = 0; }
          if (b > 255) { b = 0; }

          var x = i * TILE_SIZE;
          var y = j * TILE_SIZE;
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x - .5, y - .5, TILE_SIZE, TILE_SIZE);

          TextRenderer.render(ctx, `${letters[i]}${j}`, x + TILE_SIZE / 2, y + TILE_SIZE / 2, {
            scale: 3.5
          });
        }
      }
      ctx.restore();

      // Show direction
      ctx.save();
      ctx.translate(
        player.x,
        player.y
      );
      var angle = new Vec2(player.x, player.y)
        .sub(new Vec2(mouse.x, mouse.y))
        .direction() + 90;
      ctx.rotate(Math.toRadian(angle));
      ctx.globalAlpha = .75;
      ctx.drawImage(cursorImg, - cursorImg.width / 2, - 8);
      ctx.restore();

      player.render(ctx);

      for (var key of Object.keys(players)) {
        var p = players[key];
        p.render(ctx);
      }

      // sorting
      // toDraw.sort((l, r) => l.y - r.y);

      // for (var i = 0; i < toDraw.length; i++) {
        // toDraw[i].render(ctx);
      // }

      ctx.restore();
      
      // GUI
      ctx.save();
      ctx.scale(scale, scale);
      
      gui.render(ctx);

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