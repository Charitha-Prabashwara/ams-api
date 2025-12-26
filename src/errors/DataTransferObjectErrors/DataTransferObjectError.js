class DataTransferObjectError extends Error {
  constructor(message = '', statusCode = 400, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = DataTransferObjectError;
