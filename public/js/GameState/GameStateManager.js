var GameStateManager = (function() {

  function GameStateManager() {
    this.MENUSTATE = 0;
    this.GAMESTATE = 1;

    this.gameStates = [];
    this.gameStates.push(new MenuState(this));
    this.gameStates.push(new GameState(this));
    this.setState(this.MENUSTATE);
  }

  GameStateManager.prototype.setState = function(state, args) {
    this.currentState = state;
    this.gameStates[this.currentState].init(args);
  }

  GameStateManager.prototype.handleInput = function () {
    this.gameStates[this.currentState].handleInput();
  }

  GameStateManager.prototype.update = function() {
    this.gameStates[this.currentState].update();
  }

  GameStateManager.prototype.render = function(ctx) {
    this.gameStates[this.currentState].render(ctx);
  }

  GameStateManager.prototype.keyDown = function(key) {
    this.gameStates[this.currentState].keyDown(key);
  }

  GameStateManager.prototype.keyUp = function (key) {
    this.gameStates[this.currentState].keyUp(key);
  }
  
  GameStateManager.prototype.mouseMove = function(e) {
    this.gameStates[this.currentState].mouseMove(e);
  }

  GameStateManager.prototype.click = function (e) {
    this.gameStates[this.currentState].click(e);
  }

  GameStateManager.prototype.rightClick = function (e) {
    this.gameStates[this.currentState].rightClick(e);
  }

  return GameStateManager;
})();