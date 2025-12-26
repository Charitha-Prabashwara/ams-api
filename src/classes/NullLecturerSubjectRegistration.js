class NullLecturerSubjectRegistration {
  constructor() {
    if (NullLecturerSubjectRegistration.instance) {
      return NullLecturerSubjectRegistration.instance;
    }
    Object.freeze(this);
    NullLecturerSubjectRegistration.instance = this;
  }
}

module.exports = new NullLecturerSubjectRegistration();
