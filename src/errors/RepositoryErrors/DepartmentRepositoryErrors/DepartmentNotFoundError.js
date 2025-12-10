const DepartmentRepositoryError = require('./DepartmentRepositoryError');

class DepartmentNotFoundError extends DepartmentRepositoryError {
  constructor() {
    super('Department not found', 404);
  }
}

module.exports = DepartmentNotFoundError;
