var MobPeach = class MobPeach extends Mob {
  constructor(x, y) {
    super(x, y);

    this.name  = 'Peach';
    this.type  = 'peach';
    this.lvl   = 1;
    this.hp    = this.maxHP = 22;
    this.speed = 0.25;

    this.attackRange = 22;
    this.attackDelay    = 1000;
    this.attackInterval = 2000;
    this.damage = 1;

    this.init();
  }

  init() {
    this.changeDestination();
  }

  changeDestination() {
    var timeToRest = 7000;
    var func = () => {
      var range = 120; // 90
      var x = this.pos.x + randomInt(-range, range);
      var y = this.pos.y + randomInt(-range, range);
      var dest = new Vec2(x, y);

      this.setDestination(dest, 0, () => {
        timeToRest = randomInt(4000, 10000);
        this.restInterval = setTimeout(func, timeToRest);
      });
    };
    func();
  }

  update() {
    super.update();
  };

};
