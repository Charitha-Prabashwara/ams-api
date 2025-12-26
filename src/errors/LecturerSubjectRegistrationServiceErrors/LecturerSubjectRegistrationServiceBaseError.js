class LecturerSubjectRegistrationServiceBaseError extends Error {
  constructor(message = 'Lecturer Subject Registration error', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = LecturerSubjectRegistrationServiceBaseError;