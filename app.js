var fs = require('fs');
eval(fs.readFileSync('server/js/utils.js') + '');
eval(fs.readFileSync('server/js/Player.js') + '');
eval(fs.readFileSync('server/js/Vec2.js') + '');

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

// To delete?
app.get('/', function (req, res) {
  console.log('Connected ' + req.ip);
});

var server = app.listen(80, function () {
  console.log('Server is running...');
});


var players  = [];
var mobs = [];
var spells = [];

function init() {

}

function run() {
  var startTime = Date.now();
  // Main loop
  var loop = function () {
    // Mobs
    for (var mob of mobs) {
      if (!mob) { continue; }
      mob.update();

      var stuck = false;
      if (mob.pos.x <= 0) {
        mob.pos.x = 0;
        stuck = true;
      }
      else if (mob.pos.x >= map.general.w) {
        mob.pos.x = map.general.w;
        stuck = true;
      }
      
      if (mob.pos.y <= 0) {
        mob.pos.y = 0;
        stuck = true;
      }
      else if (mob.pos.y >= map.general.h) {
        mob.pos.y = map.general.h;
        stuck = true;
      }

      if (stuck && mob.dest) {
        mob.changeDestination();
      }

      // todo: check mob collision with arrow
      // ...

    }

    // Spells
    for (var spell of spells) {
      if (!spell) { continue; }
      spell.update();

      // check out of bounds
      if (spell.pos.x <= 0 ||
          spell.pos.x >= map.general.w) {
        io.emit('spell_delete', {
          id: spell.id
        });
        delete spells[spell.id];
        continue;
      }
      
      for (var mob of mobs) {
        if (!mob) { continue; }

        if (mob.pos.distance(spell.pos) <= 20) {
          
          damageMob(mob, spell.damage, spell.initiatorID);
          
          io.emit('spell_delete', {
            id: spell.id
          });
          delete spells[spell.id];
          break;
        }
      }
    }

    if (Date.now() - startTime > 40) {
      startTime = Date.now();
      // Send mobs data
      var mobsFiltered = mobs.filter(m => m != null && m.moved);
      for (var mob of mobsFiltered) {
        io.emit('mob_move', {
          id:           mob.id,
          x:            mob.pos.x,
          y:            mob.pos.y,
          facingRight:  mob.facingRight
        });
      }
      // Send spells data
      for (var spell of spells.filter(el => el != null)) {
        io.emit('spell_update', {
          id:          spell.id,
          x:           spell.pos.x,
          y:           spell.pos.y,
          facingRight: spell.facingRight
        });
      }
    }
  };
  setInterval(loop, 16);
}

init();
run();

function getAllUsers() {
  var obj = [];
  for (var key of Object.keys(players)) {
    obj.push(players[key]);
  }
  return obj;
}

function packUsers() {
  var packet = {};
  for (var user of getAllUsers()) {
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
  if (players[id]) {
    console.log('what the fuck?');
  }

  socket.on('disconnect', function () {
    var user = players[id];
    if (!user) {
      return;
    }

    user._disconnected = true;
    socket.broadcast.emit('_leave', id);
    delete players[id];

    console.log(id + ' left');
  });

  // new player connected
  socket.on('c_enter', function(playerData) {
    // remove later
    console.log(`${playerData.name}#${id} joined (online: ${(Object.keys(players).length + 1)})`);

    var player = new Player(
      id,
      playerData.name,
      playerData.className,
      new Vec2(playerData.x, playerData.y)
    );
    player.facingRight  = playerData.facingRight;
    player.currentState = playerData.currentState;

    // Вошел новый игрок - отправляем всем данные о нем
    socket.broadcast.emit('s_enter', {
      id:           player.id,
      name:         player.name,
      className:    player.className,
      x:            player.pos.x,
      y:            player.pos.y,
      facingRight:  player.facingRight,
      currentState: player.currentState
    });

    // Send him everyone else's data
    socket.emit('s_hello', {
      // me:   {
      //   hp:    player.hp,
      //   maxHP: player.maxHP,
      //   x:     player.pos.x,
      //   y:     player.pos.y
      // },
      players: getAllUsers()
      // map:   packMap(),
    });
    // store his data in `players`
    
    players[id] = player;
  });

  socket.on('c_update', function (packet) {
    if (!players[id]) {
      return;
    }

    // update his data in `players`
    var p = players[id];
    p.pos.x        = packet.x;
    p.pos.y        = packet.y;
    p.currentState = packet.currentState;
    p.facingRight  = packet.facingRight;
    // Send everyone else his data
    packet.id = id;
    socket.broadcast.emit('s_update', packet);
  });

  socket.on('rest', function () {
    if (!players[id]) {
      return;
    }
    // update his data in `players`
    var p = players[id];
    p.currentState = 'IDLE';
    // Send everyone else his data
    socket.broadcast.emit('rest', id);
  });

  socket.on('attack', function (user) {
    // todo: can we attack in the first place?
    // 
    var px = user.x;
    var py = user.y;

    switch (user.className) {
      case 'swordsman':
        // instantly proccess attack - find nearby mobs
        for (var mob of mobs) {
          if (!mob) { continue; }
          var x = mob.pos.x - px;
          var y = mob.pos.y - py;
          var dist = Math.sqrt(x * x + y * y);
          // todo: check attack radius
          // ...
          if (dist < 38) {
            damageMob(mob, 18, id);
          }
        }
        break;
      case 'archer':
        var speed = 2.5;
        if (!user.facingRight) {
          speed *= -1;
        }
        // spawn an arrow
        ++nextIndex;
        var arrow = new SpellArrow(id, px, py - 14, speed, 0);
        arrow.id = nextIndex;
        spells[nextIndex] = arrow;
        
        // Send everyone arrow's data
        io.emit('spell_new', {
          id:   nextIndex,
          type: arrow.type,
          x:    arrow.pos.x,
          y:    arrow.pos.y
        });
        break;
    }

    // update his data in `players`
    players[id].currentState = user.currentState;
    // Send everyone else his data
    socket.broadcast.emit('attack', id);
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
