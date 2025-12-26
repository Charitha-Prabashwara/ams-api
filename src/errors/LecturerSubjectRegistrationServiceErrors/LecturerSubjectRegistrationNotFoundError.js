const LecturerSubjectRegistrationServiceBaseError = require('./LecturerSubjectRegistrationServiceBaseError')

class LecturerSubjectRegistrationNotFoundError extends LecturerSubjectRegistrationServiceBaseError{
    constructor(){
        super("Lecturer Subject Registration Not Found", 404)
    }
}

module.exports = LecturerSubjectRegistrationNotFoundError;