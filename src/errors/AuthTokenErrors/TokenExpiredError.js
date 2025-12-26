const TokenErrorBaseClass = require('./TokenErrorBaseClass');

class TokenExpiredError extends TokenErrorBaseClass {
  constructor() {
    super('Token expired', 401);
  }
}

module.exports = TokenExpiredError;
