const authServiceBaseError = require('./authServiceBaseError');

class UnauthorizedError extends authServiceBaseError {
  constructor() {
    super('Unauthorized', 401);
  }
}

module.exports = UnauthorizedError;
