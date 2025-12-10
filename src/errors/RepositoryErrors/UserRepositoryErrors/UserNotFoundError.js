const UserRepositoryError = require('./UserRepositoryError');

class UserNotFoundError extends UserRepositoryError {
  constructor() {
    super('User not found', 404);
  }
}

module.exports = UserNotFoundError;
