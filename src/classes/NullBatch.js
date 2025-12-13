class NullBatch {
  constructor() {
    if (NullBatch.instance) {
      return NullBatch.instance;
    }
    Object.freeze(this);
    NullBatch.instance = this;
  }
}

module.exports = new NullBatch();
