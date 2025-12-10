class NullDepartment {
  constructor() {
    if (NullDepartment.instance) {
      return NullDepartment.instance;
    }
    Object.freeze(this);
    NullDepartment.instance = this;
  }
}

module.exports = new NullDepartment();
