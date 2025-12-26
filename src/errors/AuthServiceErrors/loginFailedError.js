const authServiceBaseError = require('./authServiceBaseError');

class LoginFailedError extends authServiceBaseError {
  constructor() {
    super('Login failed', 401);
  }
}

module.exports = LoginFailedError;
