require('dotenv').config({ quiet: true });
class Config {
  constructor() {
    if (Config.instance == null) {
      const env = process.env;

      this.DB_MONGODB_URI = env.DB_MONGODB_URI;
      this.DB_MONGODB_DATABASE = env.DB_MONGODB_DATABASE;
      this.APPLICATION_PORT = env.APPLICATION_PORT;
      this.SLAT_ROUNDS = env.SLAT_ROUNDS;
      this.ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
      this.REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
      this.ACCESS_TOKEN_TTL = env.ACCESS_TOKEN_TTL;
      this.REFRESH_TOKEN_TTL = env.REFRESH_TOKEN_TTL;
      this.NODE_ENV = env.NODE_ENV;
      this.REFRESH_TOKEN_COOKIE_TTL = env.REFRESH_TOKEN_COOKIE_TTL;
      Config.instance = this;
    }
    return Config.instance;
  }
}

const config = new Config();
Object.freeze(config);
module.exports = config;
