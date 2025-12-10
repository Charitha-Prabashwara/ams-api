class EnvTypes {
  constructor() {
    if (EnvTypes.instance == null) {
      this.ENV_TYPES = ['development', 'production', 'test'];
      this.DEVELOPMENT = this.ENV_TYPES[0];
      this.PRODUCTION = this.ENV_TYPES[1];
      this.TEST = this.ENV_TYPES[2];
      EnvTypes.instance = this;
    }
    return EnvTypes.instance;
  }
}

const envTypes = new EnvTypes();
Object.freeze(envTypes);
module.exports = envTypes;
