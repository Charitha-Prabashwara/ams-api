const PasswordErrorBaseClass = require('./PasswordErrorBaseClass');

class InvalidPasswordProvided extends PasswordErrorBaseClass {
  constructor() {
    super('Invalid password provided', 401);
  }
}

module.exports = InvalidPasswordProvided;
