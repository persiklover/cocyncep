class Swordsman extends Class {
  constructor(x, y, name) {
    super(x, y, name);

    this.className = 'swordsman';

    this.anim = new AnimationManager(
      Loader.loadImage(`img/${this.className}.png`),
      [2, 2, 2],       // imagesNum
      [600, 120, 70],  // delays
      [23, 33]         // sizes
    );
    this.anim.play();

    this.states = ['IDLE', 'RUN', 'ATTACK'];
    this.currentState = this.states[0];

    this.offset = { x: 11, y: 33 };
  }
}