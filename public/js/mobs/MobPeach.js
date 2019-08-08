class MobPeach extends Entity {
  constructor(x, y) {
    super(x, y, 'Peach', new AnimationManager(
      Loader.loadImage('img/peach.png'),
      [2, 2],      // imagesNum
      [600, 350],  // delays
      [13, 13]     // sizes
    ));

    this.offset = {x: 6, y: 13};

    this.states = ['IDLE', 'ATTACK'];
    this.currentState = this.states[0];
  }

  update() {
    this.anim.setIndex(this.states.indexOf(this.currentState));
    this.anim.facingRight = this.facingRight;

    super.update();
  }

  render(ctx, x = this.x, y = this.y) {
    super.render(ctx);
    super.renderName(ctx);
    super.renderHealth(ctx);
  }
}