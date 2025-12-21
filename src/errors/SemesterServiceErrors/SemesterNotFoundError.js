const SemesterServiceBaseError = require('./SemesterServiceBaseError')

class SemesterNotFoundError extends SemesterServiceBaseError{
    constructor(){
        super('Semester not found', 404);
    }
}

module.exports = SemesterNotFoundError;