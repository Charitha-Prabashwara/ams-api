class NullCourse {
  constructor() {
    if (NullCourse.instance) {
      return NullCourse.instance;
    }
    Object.freeze(this);
    NullCourse.instance = this;
  }
}

module.exports = new NullCourse();
