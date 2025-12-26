const TokenErrorBaseClass = require('./TokenErrorBaseClass');

class JsonWebTokenError extends TokenErrorBaseClass {
  constructor() {
    super('Invalid or tampered token', 403);
  }
}

module.exports = JsonWebTokenError;
