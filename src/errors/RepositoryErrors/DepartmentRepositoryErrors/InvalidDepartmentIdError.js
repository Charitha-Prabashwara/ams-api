const DepartmentRepositoryError = require('./DepartmentRepositoryError');

class InvalidDepartmentIdError extends DepartmentRepositoryError {
  constructor() {
    super('Invalid Department ID', 400);
  }
}

module.exports = InvalidDepartmentIdError;
