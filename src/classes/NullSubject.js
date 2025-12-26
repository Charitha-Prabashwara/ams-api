class NullSubject {
  constructor() {
    if (NullSubject.instance) {
      return NullSubject.instance;
    }
    Object.freeze(this);
    NullSubject.instance = this;
  }
}

module.exports = new NullSubject();
