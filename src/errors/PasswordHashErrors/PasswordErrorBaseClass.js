class PasswordErrorBaseClass extends Error {
  constructor(message = 'Invalid password provided', statusCode = 401) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = PasswordErrorBaseClass;
