class NullLecture {
  constructor() {
    if (NullLecture.instance) {
      return NullLecture.instance;
    }
    Object.freeze(this);
    NullLecture.instance = this;
  }
}

module.exports = new NullLecture();
