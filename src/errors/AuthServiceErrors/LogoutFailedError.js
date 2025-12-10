const authServiceBaseError = require('./authServiceBaseError');

class LogoutFailed extends authServiceBaseError {
  constructor() {
    super('Logout failed', 401);
  }
}

module.exports = LogoutFailed;
