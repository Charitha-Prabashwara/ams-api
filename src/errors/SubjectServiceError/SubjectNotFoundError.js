const SubjectServiceBaseError = require('./SubjectServiceBaseError');

class SubjectNotFoundError extends SubjectServiceBaseError {
  constructor() {
    super('Subject not found', 404);
  }
}

module.exports = SubjectNotFoundError;
