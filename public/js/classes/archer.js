class Archer extends Class {
  constructor(x, y, name) {
    super(x, y, name);

    this.className = 'archer';

    this.anim = new AnimationManager(
      Loader.loadImage(`img/${this.className}.png`),
      [2, 2, 2],       // imagesNum
      [600, 120, 70],  // delays
      [25, 38]         // sizes
    );
    this.anim.play();

    this.states = ['IDLE', 'RUN', 'ATTACK'];
    this.currentState = this.states[0];

    this.offset = { x: 11, y: 38 };

    this._maxSpeed = 1.35;
  }
}