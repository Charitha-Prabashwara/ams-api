const UserServiceBaseError = require('./UserServiceBaseError');

class UserUpdateFailed extends UserServiceBaseError {
  constructor(error) {
    super('User update failed: ', 400);
  }
}

module.exports = UserUpdateFailed;
