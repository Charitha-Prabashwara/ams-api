const authServiceBaseError = require('./authServiceBaseError');

class DoesNotHavePermissionError extends authServiceBaseError {
  constructor() {
    super('Invalid Credentials', 403);
  }
}

module.exports = DoesNotHavePermissionError;
