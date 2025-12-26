const DataTransferObjectError = require('./DataTransferObjectError');

class ValidationFailedError extends DataTransferObjectError {
  constructor(message, statusCode = 400, details) {
    super(message, statusCode, details);
  }
}
module.exports = ValidationFailedError;
