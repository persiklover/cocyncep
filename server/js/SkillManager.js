var SkillManager = (function() {
  
  return class {
    constructor(prof = "") {
      switch (prof) {
        case "archer":
          this[0] = Archer_0;
          break;
        case "scientist":
          this[0] = Scientist_0;
          break;
      }
    }

    get(index = 0) { return this[index]; }
  }
})();