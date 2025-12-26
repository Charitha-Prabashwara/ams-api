const UserRepositoryError = require('./UserRepositoryError');

class DuplicateKeyError extends UserRepositoryError {
  constructor(error) {
    super('Duplicate Key Error: ', 409);

    this.details = {
      keys: error?.keyValue ? Object.keys(error.keyValue) : [],
    };
  }
}

module.exports = DuplicateKeyError;
