const authServiceBaseError = require('./authServiceBaseError');

class InvalidAuthFormatError extends authServiceBaseError {
  constructor() {
    super('Invalid Authentication Format', 403);
  }
}

module.exports = InvalidAuthFormatError;
