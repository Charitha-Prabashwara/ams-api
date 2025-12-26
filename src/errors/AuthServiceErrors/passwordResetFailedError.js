const authServiceBaseError = require('./authServiceBaseError');

class PasswordResetFailedError extends authServiceBaseError {
  constructor() {
    super('Password Rest Failed', 400);
  }
}

module.exports = PasswordResetFailedError;
