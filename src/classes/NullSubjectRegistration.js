class NullSubjectRegistration {
  constructor() {
    if (NullSubjectRegistration.instance) {
      return NullSubjectRegistration.instance;
    }
    Object.freeze(this);
    NullSubjectRegistration.instance = this;
  }
}

module.exports = new NullSubjectRegistration();
