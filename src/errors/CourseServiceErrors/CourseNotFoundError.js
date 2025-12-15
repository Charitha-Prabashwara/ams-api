
const CourseServiceBaseError = require('./CourseServiceBaseError')

class CourseNotFoundError extends CourseServiceBaseError{
    constructor(){
        super("Course not found", 404)
    }
}

module.exports= CourseNotFoundError