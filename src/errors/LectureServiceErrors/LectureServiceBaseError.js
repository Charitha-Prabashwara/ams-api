class LectureServiceBaseError extends Error {
  constructor(message = 'Lecture error', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = LectureServiceBaseError;
