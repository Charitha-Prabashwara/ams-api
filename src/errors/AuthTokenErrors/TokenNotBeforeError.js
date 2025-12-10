const TokenErrorBaseClass = require('./TokenErrorBaseClass');

class TokenNotBefore extends TokenErrorBaseClass {
  constructor() {
    super('Token not active yet', 403);
  }
}

module.exports = TokenNotBefore;
