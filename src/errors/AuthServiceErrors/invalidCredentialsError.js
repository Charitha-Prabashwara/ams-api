const authServiceBaseError = require('./authServiceBaseError');

class InvalidCredentialsError extends authServiceBaseError {
  constructor() {
    super('Invalid Credentials', 401);
  }
}

module.exports = InvalidCredentialsError;
