const TokenErrorBaseClass = require('./TokenErrorBaseClass');

class GeneralTokenError extends TokenErrorBaseClass {
  constructor() {
    super('token error', 403);
  }
}

module.exports = GeneralTokenError;
