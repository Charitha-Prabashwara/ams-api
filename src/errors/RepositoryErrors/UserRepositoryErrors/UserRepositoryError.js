class UserRepositoryError extends Error {
  constructor(message = 'Repository error', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = UserRepositoryError;
