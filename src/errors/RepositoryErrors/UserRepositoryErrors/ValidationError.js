const UserRepositoryError = require('./UserRepositoryError');

class ValidationError extends UserRepositoryError {
  constructor(err) {
    super('Validation Error', 400);

    this.details = Object.keys(err.errors || {}).map((field) => ({
      field,
      message: err.errors[field].message,
      kind: err.errors[field].kind,
    }));
  }
}

module.exports = ValidationError;
