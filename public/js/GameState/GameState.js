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

  var players = {
    _list: [],

    add(x = 0, y = 0, prof = "", name = "", id = -1) {
      var p = new Player(x, y, prof, name);
      this._list[id] = p;
      return p;
    },

    remove(id = -1) {
      delete this._list[id];
    },

    get(id = -1) {
      return this._list[id];
    },

    toArray() {
      var arr = [];
      for (var key of Object.keys(this._list)) {
        arr.push(this._list[key]);
      }

      return arr;
    }
  };
  var sprites = [];
  var mobs = [];
  var skills = [];

  var covered = [];
  var target = null;
  var targetTexture = Loader.loadImage('img/target.png');

  var gui;

  var dustSpawner;
  var hitTextManager;

  var cursorImg = Loader.loadImage('img/cursor.png');

  var inventoryTexture = Loader.loadImage('img/inventory.png');
  var inventoryOpen = false;

  return class GameState {
    constructor(gsm) {
      this.gsm = gsm;
    }

    init(args) {
      // 200, 200
      player = new Player(200, 200, args.prof, args.name);
      console.log(player.prof);

      gui = new GUI(player);

      // Sprites
      Loader.loadImage('img/map.png', function(texture) {
        floor = new Sprite(texture, 0, 0);
      });

      // Sprites
      // sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 110, 250, { x: 6, y: 9 }));
      // sprites.push(new Sprite(Loader.loadImage('img/seashell-1.png'), 320, 120, { x: 6, y: 9 }));

      // mobs.push(new AnimatedObject(350, 270, new Animation(
      //   Loader.loadImage(`img/crab.png`),
      //   [2, 2],      // imagesNum
      //   [3500, 120],  // delays
      //   [31, 13],    // sizes
      //   { x: 15, y: 13 }
      // )));

      dustSpawner = new DustSpawner();
      hitTextManager = new HitTextManager();

      setInterval(function() {
        if (_moved) {
          io.emit('c_update', {
            x:            player.x,
            y:            player.y,
            dx:           player.dx,
            dy:           player.dy,
            facingRight:  player.facingRight,
            currentState: player.currentState
          });
        }
        if (_stoppedMoving) {
          _stoppedMoving = false;
          io.emit('c_rest', null);
        }
      }, 40);

      // c_ -> sent from client
      // s_ -> sent from server
      io.emit('c_enter', {
        name:         player.name,
        prof:         player.prof,
        x:            player.x,
        y:            player.y,
        facingRight:  player.facingRight,
        currentState: player.currentState
      });

      io.on('s_enter', function(pData) {
        var p = players.add(pData.x, pData.y, pData.prof, pData.name, pData.id);
        p.maxHP     = pData.stats.maxHP;
        p.hp        = pData.stats.hp;
        p.hpRegen   = pData.stats.hpRegen;
        p.def       = pData.stats.def;
        p._maxSpeed = pData.stats.speed;
        p.crit      = pData.stats.crit;
      });

      io.on('s_update', function(pData) {
        var p = players.get(pData.id);
        if (!p) {
          return;
        }

        p.x  = pData.x;
        p.y  = pData.y;
        p.dx = pData.dx;
        p.dy = pData.dy;
        p.currentState = pData.currentState;
      });

      io.on('s_changeDir', function(pData) {
        var p = players.get(pData.id);
        if (!p) {
          return;
        }

        p.facingDirection.x = (pData.facingRight) ? 1 : -1;
      });

      io.on('s_rest', function(id) {
        var p = players.get(id);
        if (!p) {
          return;
        }

        p.dx = 0;
        p.dy = 0;
        p.currentState = 0;
      });

      io.on('s_leave', function(id) {
        players.remove(id);
      });

      io.on('s_hello', function(packet) {
        console.log(packet);

        var me = packet.me;
        player.id        = me.id;
        player.maxHP     = me.stats.maxHP;
        player.hp        = me.stats.hp;
        player.def       = me.stats.def;
        player._maxSpeed = me.stats.speed;
        player.crit      = me.stats.crit;

        for (var key of Object.keys(packet.players)) {
          var data = packet.players[key];

          var p = players.add(data.pos.x, data.pos.y, data.prof, data.name, data.id);
          p.id        = data.id;
          p.maxHP     = data.stats.maxHP;
          p.hp        = data.stats.hp;
          p.hpRegen   = data.stats.hpRegen;
          p.def       = data.stats.def;
          p._maxSpeed = data.stats.speed;
          p.crit      = data.stats.crit;
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

      io.on('s_attack', function(id) {
        var p = players.get(id);
        if (!p) {
          return;
        }

        p.attack(0);
      });

      io.on('s_playerAnimation', function(data) {
        // is it us?
        if (data.id == player.id) {
          player.attack(data.animationIndex);
        }
        else {
          var p = players.get(data.id);
          if (!p) {
            return;
          }

          p.attack(data.animationIndex);
        }
      });

      io.on('s_damagePlayer', function(data) {
        var x, y, p;

        // is it us?
        if (data.id == player.id) {
          p = player;
        }
        else {
          p = players.get(data.id);
          if (!p) {
            return;
          }
        }

        p.hp = data.hp;

        x = p.x;
        y = p.y - p.anim.height - 18;
        hitTextManager.create(x, y, data.damage, data.isCrit);
      });
      
      io.on('s_playerDied', function(playerData) {
        var _p = null;

        // is it us?
        if (playerData.id == player.id) {
          _p = player;
          
        }
        else {
          _p = players.get(playerData.id);
          if (!_p) {
            return;
          }
        }

        _p.x = playerData.x;
        _p.y = playerData.y;
        _p.lvl   = 1;
        _p.xp    = 0;
        _p.maxHP = playerData.stats.maxHP;
        _p.hp    = playerData.stats.hp;
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
      camera.y = player.y - player.anim.height/2 - HEIGHT / 2;

      if (camera.x < 0) {
        camera.x = 0;
      }
      if (camera.y < 0) {
        camera.y = 0;
      }

      for (var p of players.toArray()) {
        p.update();
      }

      for (var key of Object.keys(skills)) {
        var s = skills[key];
        s.update();
      }

      for (var mob of mobs) {
        mob.update();
      }

      // target
      covered = [];
      for (var sprite of sprites) {
        if (sprite.getBoundingBox().intersects(mouse.x, mouse.y)) {
          covered.push(sprite);
        }
      }
      target = covered.sort((l, r) => l.y - r.y).pop();

      dustSpawner.update();

      hitTextManager.update();

      gui.update();
    }

    render(ctx = new CanvasRenderingContext2D) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, WIDTH * scale, HEIGHT * scale);

      ctx.save();
      ctx.scale(scale, scale);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-camera.x, -camera.y);

      if (floor) {
        floor.render(ctx);
      }

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

      // if (target) {
      //   ctx.drawImage(
      //     targetTexture,
      //     target.x - targetTexture.width / 2,
      //     target.y - targetTexture.height / 2 - 2
      //   );
      // }

      var toDraw = []
        .concat(sprites)
        .concat(mobs)
        .concat(player)
        .concat(dustSpawner.particles)
        .concat(hitTextManager.particles);
      
      for (var p of players.toArray()) {
        toDraw.push(p);
        for (var particle of p._dustSpawner.particles) {
          toDraw.push(particle);
        }
      }

      for (var key of Object.keys(skills)) {
        var s = skills[key];
        toDraw.push(s);
      }

      // sorting
      toDraw.sort((l, r) => l.y - r.y);
      // console.log(toDraw);

      for (var i = 0; i < toDraw.length; i++) {
        try {
          toDraw[i].render(ctx);
          if (toDraw[i] instanceof Player) {
            var p = toDraw[i];
            if (p.id == player.id) {
              toDraw[i].renderName(ctx);
            }
            else {
              toDraw[i].renderName(ctx);
              toDraw[i].renderHP(ctx);
            }
          }
        }
        catch (e) {
          console.warn(toDraw[i]);
        }
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
    }

    mouseMove(e) {
      var rect = canvas.getBoundingClientRect();
      mouse.localX = (e.clientX - rect.left) / scale;
      mouse.localY = (e.clientY - rect.top)  / scale;
    }

    click(e) {
      if (player.canAttack()) {
        console.log('attack');
        io.emit('c_registerAttack', {
          index: 0,
          mouse: { x: mouse.x, y: mouse.y }
        });
      }
      _moved = true;
    }
    
    rightClick(e) {
      e.preventDefault();
    }
  }
})();