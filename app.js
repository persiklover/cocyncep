var fs = require('fs');
eval(fs.readFileSync('server/js/utils.js') + '');
eval(fs.readFileSync('server/js/Stats.js') + '');
eval(fs.readFileSync('server/js/Player.js') + '');
eval(fs.readFileSync('server/js/Vec2.js') + '');
eval(fs.readFileSync('server/js/Skills/Skill.js') + '');
eval(fs.readFileSync('server/js/Skills/SkillArrow.js') + '');

var express = require('express');
var app = express();

var startPoint = {
  x: 200,
  y: 200
};

app.use(express.static(__dirname + '/public'));

var server = app.listen(80, function () {
  console.log('Server is running...');
});

var players = [];
var mobs = [];
var spells = [];

var currentId = -1;

function run() {
  setInterval(function() {
    for (var player of getAllPlayers()) {
      player.update();
    }

    // Spells
    for (var i = 0; i < spells.length; i++) {
      var spell = spells[i];
      if (!spell) {
        continue;
      }

      if (spell._dead) {
        io.emit("s_removeSkill", spells.indexOf(spell));

        delete spells[i];
      }
      else {
        spell.update();

        for (var p of getAllPlayers()) {
          // exclude the initiator
          if (p.id == spell.initiatorID) {
            continue;
          }

          if (spell.pos.distance(p.pos) < spell.hitDistance) {
            spell._dead = true;

            damagePlayer(p, spell);
          }
        }
      }
    }
  }, 16);
}

run();

function getAllPlayers() {
  var obj = [];
  for (var key of Object.keys(players)) {
    obj.push(players[key]);
  }
  return obj;
}

function packUsers() {
  var packet = {};
  for (var user of getAllPlayers()) {
    packet = Object.assign(packet, { user });
  }
  return packet;
}

function packMap() {
  var _map = clone(map);
  // Add dynamic info
  _map.mobs = [];
  for (var mob of mobs.filter(el => el != null)) {
    _map.mobs.push({
      id:    mob.id,
      hp:    mob.hp,
      maxHP: mob.maxHP,
      type:  mob.type,
      x:     mob.pos.x,
      y:     mob.pos.y,
    });
  }

  return _map;
}

var io = require('socket.io')(server);
io.on('connection', function (socket) {
  var id = socket.id;

  socket.on('disconnect', function () {
    var user = players[id];
    if (!user) {
      return;
    }

    user._disconnected = true;
    socket.broadcast.emit('s_leave', id);
    delete players[id];

    console.log(id + ' left');
  });

  socket.on('c_changeDir', function() {
    var user = players[id];
    if (!user) {
      return;
    }

    user.facingRight = !user.facingRight;
    socket.broadcast.emit('s_changeDir', {
      id: id,
      facingRight: user.facingRight
    });

  });

  socket.on('c_nameValidation', function(name = "") {
    var error = "";

    for (var player of getAllPlayers()) {
      if (name == player.name) {
        error = "Name already exists!";
        socket.emit('s_nameValidation', error);
        return;
      }
    }

    name = name.trim();
    
    if (name.length < 2) {
      error = "Use more letters, please"; 
    }
    else if (name.length > 15) {
      error = 'Are you loh? Your name is too long';
    }
   
    socket.emit('s_nameValidation', error);
  });

  socket.on('c_enter', function(playerData) {
    // remove later
    console.log(`${playerData.name}#${id} joined (online: ${(Object.keys(players).length + 1)})`);

    var player = new Player(
      id,
      playerData.name,
      playerData.prof,
      new Vec2(playerData.x, playerData.y)
    );
    player.facingRight  = playerData.facingRight;
    player.currentState = playerData.currentState;

    // Вошел новый игрок - отправляем всем данные о нем
    socket.broadcast.emit('s_enter', {
      id:           player.id,
      name:         player.name,
      prof:         player.prof,
      stats:        player.stats,
      x:            player.pos.x,
      y:            player.pos.y,
      facingRight:  player.facingRight,
      currentState: player.currentState
    });

    // Send him everyone else's data
    socket.emit('s_hello', {
      me:   {
        id:    id,
        lvl:   player.lvl,
        stats: player.stats,
        x:     player.pos.x,
        y:     player.pos.y
      },
      players: getAllPlayers()
      // map:   packMap(),
    });
    // store his data in `players`
    
    players[id] = player;
  });

  socket.on('c_update', function(packet) {
    if (!players[id]) {
      return;
    }

    // update his data in `players`
    var p = players[id];
    p.pos.x        = packet.x;
    p.pos.y        = packet.y;
    p.dx           = packet.dx;
    p.dy           = packet.dy;
    p.currentState = packet.currentState;
    p.facingRight  = packet.facingRight;
    // Send everyone else his data
    packet.id = id;
    socket.broadcast.emit('s_update', packet);
  });

  socket.on('c_rest', function() {
    if (!players[id]) {
      return;
    }
    // update his data in `players`
    var p = players[id];
    p.dx = 0;
    p.dy = 0;
    p.currentState = 0;
    // Send everyone else his data
    socket.broadcast.emit('s_rest', id);
  });

  socket.on('c_registerAttack', function(attackData) {
    // проигрываем анимацию 
    io.emit('s_playerAnimation', {
      id: id,
      animationIndex: 2 + attackData.index
    });

    var player = players[id];
    if (!player) {
      return;
    }

    switch (player.prof) {
      case 'scientist':

        for (var p of getAllPlayers()) {
          // exclude the initiator
          if (p.id == id) {
            continue;
          }

          if (p.pos.distance(player.pos) < 40) {
            var angle = new Vec2(attackData.mouse.x, attackData.mouse.y)
              .sub(player.pos)
              .normalize();

            var angle2 = p.pos
              .clone()
              .sub(player.pos)
              .normalize();

            if (angle.dot(angle2) > .65) {
              damagePlayer(p, {
                damage: 35,
                initiatorID: id
              });
            }
          }
        }

        break;
      case 'archer':
        var speed = new Vec2(attackData.mouse.x, attackData.mouse.y)
          .sub(player.pos)
          .normalize()
          .mul(4.25);

        // spawn an arrow
        var arrow = new SkillArrow(id, player.pos.x, player.pos.y, speed.x, speed.y);
        arrow.id = ++currentId;
        spells[currentId] = arrow;

        // Send everyone arrow's data
        io.emit('s_newSkill', {
          id: currentId,
          type: arrow.type,
          x: arrow.pos.x,
          y: arrow.pos.y,
          dx: arrow.speed.x,
          dy: arrow.speed.y
        });
        break;
    }

    // update his data in `players`
    players[id].currentState = attackData.index;
    // Send everyone else his data
    socket.broadcast.emit('s_attack', id);
  });
});

function damageMob(mob, damage, initiatorID) {
  // deal damage
  mob.dealDamage(damage);
  
  var isDead = mob.isDead();

  io.emit('mob_damage', {
    id:        mob.id,
    hp:        mob.hp,
    maxHP:     mob.maxHP,
    isDead:    isDead,
    // might be useful for later
    initiator: initiatorID,
  });

  var player = players[initiatorID];
  if (isDead) {
    // Give xp to attack initiator
    var lvlBefore = player.lvl;
    // todo: calculete additional xp based on player level
    player.addXP(8);
    var lvlAfter = player.lvl;
    // Player didn't level up
    if (lvlAfter == lvlBefore) {
      io.to(initiatorID).emit('add_xp', player.xp);
    }
    else {
      io.to(initiatorID).emit('addlvl', {
        lvl:        player.lvl,
        hp:         player.hp,
        maxHP:      player.maxHP,
        xp:         player.xp,
        xpRequired: player.xpRequired
      });
      var socket  = io.sockets.connected[player.id];
      
      socket.broadcast.emit('lvlup', {
        id:  player.id,
        lvl: player.lvl
      });
    }

    // todo: respawn killed mob
    setTimeout(() => {
      var m = new MobPeach(randomInt(50, 150), randomInt(50, 150));
      m.id = ++nextIndex;
      mobs[nextIndex] = m;
      

      io.emit('mob_new', {
        id:   nextIndex,
        type: m.type,
        x:    m.x,
        y:    m.y,
      });
    }, 8000);

    // finally remove mob from array
    delete mobs[mob.id];
  }
  else {
    mob.dealAttack(player);
  }
}

function damagePlayer(target, skill) {
  var initiator = players[skill.initiatorID];
  var isCrit = Math.random() <= initiator.stats.crit / 100;
  var damage = skill.damage + (isCrit * skill.damage);
  var damageResult = target.dealDamage(damage);

  if (target.isDead()) {
    var deathX = target.pos.x;
    var deathY = target.pos.y;
    target.reborn();
    target.pos.x = startPoint.x;
    target.pos.y = startPoint.y;

    io.emit('s_playerDied', {
      id:     target.id,
      stats:  target.stats,
      deathX: deathX,
      deathY: deathY,
      x:      target.pos.x,
      y:      target.pos.y
    });
  }

  io.emit("s_damagePlayer", {
    id:          target.id,
    initiatorID: skill.initiatorID,
    damage:      damageResult,
    isCrit:      isCrit,
    hp:          target.stats.hp
  });
}