class NullUser {
  constructor() {
    if (NullUser.instance) {
      return NullUser.instance;
    }
    Object.freeze(this);
    NullUser.instance = this;
  }
}

module.exports = new NullUser();
