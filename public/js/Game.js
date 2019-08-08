const HEIGHT = 200;
const WIDTH  = HEIGHT * (16 / 9);

var canvas;
var ctx;
var scale = 1;

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
    [23, 33],        // sizes
    { x: 11, y: 33 }
  )
};

var statsList = {
  "archer": {

  }
};

var Game = (function() {

  var gsm;

  function Game() {
    canvas = document.querySelector('#canvas');
    canvas.width  = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d', { alpha: false });
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
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    gsm.render(ctx);
  }

  // Events
  function resize(e) {
    console.log('Resized!');

    scale = (window.innerHeight) / HEIGHT;
    if (WIDTH * scale > window.innerWidth) {
      scale = window.innerWidth / WIDTH;
    }

    canvas.width  = WIDTH  * scale;
    canvas.height = HEIGHT * scale;

    ctx.imageSmoothingEnabled = false;
    for (var prefix of ['moz', 'o', 'webkit', 'ms']) {
      ctx[prefix + 'ImageSmoothingEnabled'] = false;
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