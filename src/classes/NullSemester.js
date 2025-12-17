class NullSemester {
  constructor() {
    if (NullSemester.instance) {
      return NullSemester.instance;
    }
    Object.freeze(this);
    NullSemester.instance = this;
  }
}

module.exports = new NullSemester();
