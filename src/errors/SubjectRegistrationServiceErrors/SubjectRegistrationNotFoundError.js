const SubjectRegistrationServiceBaseError = require('./SubjectRegistrationServiceBaseError')

class SubjectRegistrationNotFoundError extends SubjectRegistrationServiceBaseError{
    constructor(){
        super("Subject Registration Not Found", 404)
    }
}

module.exports = SubjectRegistrationNotFoundError;