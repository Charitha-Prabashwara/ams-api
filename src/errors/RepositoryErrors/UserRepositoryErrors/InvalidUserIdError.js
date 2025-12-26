const UserRepositoryError = require('./UserRepositoryError');

class InvalidUserIdError extends UserRepositoryError {
  constructor() {
    super('Invalid User ID', 400);
  }
}

module.exports = InvalidUserIdError;
