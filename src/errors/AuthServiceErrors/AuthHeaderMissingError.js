const authServiceBaseError = require('./authServiceBaseError');

class AuthHeaderMissing extends authServiceBaseError {
  constructor() {
    super('Authorization header is missing.', 422);
  }
}

module.exports = AuthHeaderMissing;
