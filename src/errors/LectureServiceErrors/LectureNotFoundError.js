const LectureServiceBaseError  = require('./LectureServiceBaseError')

class LectureNotFoundError extends LectureServiceBaseError{
    constructor(){
        super('Lecture not found', 404);
    }
}

module.exports = LectureNotFoundError;