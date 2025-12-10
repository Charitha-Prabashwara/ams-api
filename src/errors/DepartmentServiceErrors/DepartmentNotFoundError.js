const DepartmentServiceBaseError = require('./DepartmentServiceBaseError');

class DepartmentNotFoundError extends DepartmentServiceBaseError {
  constructor() {
    super('Department not found', 404);
  }
}

module.exports = DepartmentNotFoundError;
