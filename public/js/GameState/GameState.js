var GameState = (function() {

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
  var skills = [];

  var gui;

  var dustSpawner;

  var cursorImg = Loader.loadImage('img/cursor.png');

  var inventoryTexture = Loader.loadImage('img/inventory.png');
  var inventoryOpen = false;

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
      // 200, 200
      player = new Player(30, 60, args.className, args.username);
      console.log(player.name);

      gui = new GUI(player);

      // Sprites
      floor = new Sprite(Loader.loadImage('img/map.png'), 0, 0);

      // Sprites
      sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 110, 250, { x: 6, y: 9 }));
      sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 320, 120, { x: 6, y: 9 }));

      mobs.push(new AnimatedObject(350, 270, new Animation(
        Loader.loadImage(`img/crab.png`),
        [2, 2],      // imagesNum
        [3500, 120],  // delays
        [31, 13],    // sizes
        { x: 15, y: 13 }
      )));

      dustSpawner = new DustSpawner();

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
      }, 25);

      // c_ -> sent from client
      // s_ -> sent from server
      io.emit('c_enter', {
        name: player.name,
        className: player.className,
        x: player.x,
        y: player.y,
        facingRight: player.facingRight,
        currentState: player.currentState
      });

      io.on('s_enter', function(playerData) {
        addDebil(playerData.x, playerData.y, playerData.className, playerData.name, playerData.id);
      });

      io.on('s_update', function(playerData) {
        var p = players[playerData.id];
        p.x = playerData.x;
        p.y = playerData.y;
        // p.facingDirection.x = (playerData.facingRight) ? 1 : -1;
        p.currentState = playerData.currentState;
      });

      io.on('s_changeDir', function(playerData) {
        var p = players[playerData.id];
        p.facingDirection.x = (playerData.facingRight) ? 1 : -1;
      });

      io.on('s_rest', function(id) {
        var p = players[id];
        p.currentState = 0;
      });

      io.on('s_leave', function(id) {
        delete players[id];
      });

      io.on('s_hello', function(packet) {
        console.log(packet);

        var me = packet.me;
        player.id = me.id;
        console.log('id = ' + me.id);

        var players = packet.players;
        for (var key of Object.keys(players)) {
          var playerData = players[key];

          addDebil(playerData.pos.x, playerData.pos.y, playerData.className, playerData.name, playerData.id);
        }
      });

      io.on('s_newSkill', function(skillData) {
        var skill;
        switch (skillData.type) {
          case "arrow": 
            skill = new SkillArrow(skillData.x, skillData.y, skillData.dx, skillData.dy);
            break;
        }

        if (skill) {
          skills[skillData.id] = skill;
        }
      });

      io.on('s_removeSkill', function(id) {
        var skill = skills[id];
        if (!skill) {
          return;
        }

        delete skills[id];
      });

      io.on('s_damagePlayer', function(data) {
        // is it us?
        if (data.id == player.id) {
          // damage ourselves
          console.warn("It hurts!");
        }
        else {
          var p = players[data.id];
          if (!p) {
            return;
          }
          
          console.log('damaged '+data.id);
        }

      });
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
      if (player.dx || player.dy) {
        dustSpawner.create(player.x, player.y);
      }

      var facingDirectionBefore = player.facingDirection;
      player.facingDirection = new Vec2(mouse.x, mouse.y)
        .sub(new Vec2(player.x, player.y))
        .normalize();
      player.update();

      if ((facingDirectionBefore.x > 0 && player.facingDirection.x < 0) ||
          (facingDirectionBefore.x < 0 && player.facingDirection.x > 0)) {
        io.emit('c_changeDir');
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
        p.update();
      }

      for (var key of Object.keys(skills)) {
        var s = skills[key];
        s.update();
      }

      for (var mob of mobs) {
        mob.update();
      }

      dustSpawner.update();

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

      var toDraw = []
        .concat(sprites)
        .concat(mobs)
        .concat(player)
        .concat(dustSpawner.particles);
      
      for (var key of Object.keys(players)) {
        var p = players[key];
        toDraw.push(p);
      }

      for (var key of Object.keys(skills)) {
        var s = skills[key];
        toDraw.push(s);
      }

      // sorting
      toDraw.sort((l, r) => l.y - r.y);
      // console.log(toDraw);

      for (var i = 0; i < toDraw.length; i++) {
        toDraw[i].render(ctx);
      }

      ctx.restore();
      
      // GUI
      ctx.save();

      ctx.scale(scale, scale);

      gui.render(ctx);

      if (inventoryOpen) {
        ctx.drawImage(
          inventoryTexture,
          WIDTH / 2 - inventoryTexture.width / 2,
          HEIGHT / 2 - inventoryTexture.height / 2
        );
      }
      
      ctx.restore();
    }

    keyDown(key) {
      var keyCode = key.keyCode;
      Keyboard.keyDown(keyCode);

      if (keyCode == Keyboard.E) {
        inventoryOpen = !inventoryOpen;
      }
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
      player.attack(mouse);
      _moved = true;
    }
    
    rightClick(e) {
      e.preventDefault();
    }
  }
})();