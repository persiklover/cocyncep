const HEIGHT = 200;
const WIDTH  = HEIGHT * (16 / 9);

var canvas;
var ctx;
var canvas2;
var ctx2;
var scale = 1;

var io;

var animationList = {
  "archer": new Animation(
    Loader.loadImage(`img/archer.png`),
    [2, 2, 2],       // imagesNum
    [600, 120, 70],  // delays
    [25, 38],        // sizes
    { x: 11, y: 38 }
  ),

  "swordsman": new Animation(
    Loader.loadImage(`img/swordsman.png`),
    [2, 2, 2],       // imagesNum
    [600, 120, 70],  // delays
    [24, 33],        // sizes
    { x: 11, y: 33 }
  )
};

var statsList = {
  "archer": {

  }
};

function connect() {
  io = io();
  io.on('connect_error', function (err) {
    // gui.log("failed to connect!");
  });

  // c_ -> sent from client
  // s_ -> sent from server
  // io.emit('c_enter', {
  //   name: player.name,
  //   className: player.className,
  //   x: player.x,
  //   y: player.y,
  //   facingRight: player.facingRight,
  //   currentState: player.currentState
  // });

  // io.on('s_enter', function (playerData) {
  //   addDebil(playerData.x, playerData.y, playerData.className, playerData.name, playerData.id);
  // });

  // io.on('s_update', function (playerData) {
  //   var p = players[playerData.id];
  //   p.x = playerData.x;
  //   p.y = playerData.y;
  //   p.facingDirection.x = (playerData.facingRight) ? 1 : -1;
  //   p.currentState = playerData.currentState;
  // });

  // io.on('s_changedDir', function (playerData) {
  //   var p = players[playerData.id];
  //   p.facingDirection.x = (playerData.facingRight) ? 1 : -1;
  // });

  // io.on('s_rest', function (id) {
  //   var p = players[id];
  //   p.currentState = 0;
  // });

  // io.on('s_leave', function (id) {
  //   console.log(`${id} left :(`);
  //   // todo: remove
  //   delete players[id];
  // });

  // io.on('s_hello', function (packet) {
  //   console.log(packet);

  //   var players = packet.players;
  //   for (var key of Object.keys(players)) {
  //     var playerData = players[key];

  //     addDebil(playerData.pos.x, playerData.pos.y, playerData.className, playerData.name, playerData.id);
  //   }
  // });
}

var Game = (function() {

  var gsm;

  function Game() {
    canvas = document.querySelector('#canvas');
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    
    canvas2 = document.querySelector('#canvas2');
    canvas2.width  = WIDTH;
    canvas2.height = HEIGHT;
    ctx2 = canvas2.getContext('2d');
  }

  function bindEvents() {
    window.onkeyup       = keyUp;
    window.onkeydown     = keyDown;
    window.onresize      = resize;
    canvas.onmousemove   = mouseMove;
    canvas.onclick       = click;
    canvas.oncontextmenu = rightClick;
  }

  function init() {
    resize();

    connect();

    gsm = new GameStateManager();
  }

  Game.prototype.run = function() {
    bindEvents();
    init();

    // Game loop
    var animate = function() {
      requestAnimationFrame(animate);
      handleInput();
      update();
      render();
    };
    animate();
  }

  function handleInput() {
    gsm.handleInput();
  }

  function update() {
    gsm.update();
  }
  
  function render() {
    ctx.clearRect(0, 0, WIDTH * scale, HEIGHT * scale);
    ctx2.clearRect(0, 0, WIDTH * scale, HEIGHT * scale);

    gsm.render(ctx);
  }

  // Events
  function resize(e) {
    console.log('Resized!');

    scale = (window.innerHeight) / HEIGHT;
    if (WIDTH * scale > window.innerWidth) {
      scale = window.innerWidth / WIDTH;
    }

    canvas.width  = canvas2.width  = WIDTH  * scale;
    canvas.height = canvas2.height = HEIGHT * scale;

    ctx.imageSmoothingEnabled = false;
    ctx2.imageSmoothingEnabled = false;
    for (var prefix of ['moz', 'o', 'webkit', 'ms']) {
      ctx[prefix + 'ImageSmoothingEnabled'] = false;
      ctx2[prefix + 'ImageSmoothingEnabled'] = false;
    }
  }

  function keyDown(e) {
    gsm.keyDown(e);
  }

  function keyUp(e) {
    gsm.keyUp(e);
  }
  
  function mouseMove(e) {
    gsm.mouseMove(e);
  }
  
  function click(e) {
    gsm.click(e);
  }

  function rightClick(e) {
    gsm.rightClick(e);
  }
  
  return Game;
})();