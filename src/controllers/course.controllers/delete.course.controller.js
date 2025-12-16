const CourseService = require('../../services/CourseService')
const {CourseNotFoundError} = require('../../errors')
const service = new CourseService()

module.exports.deleteCourseById = async(dto, req, res, next)=>{ 
    try {
        const course =await service.deleteCourseById(dto.id)
        if(service.isNullCourse(course))throw new CourseNotFoundError();
        return res.status(200).json({ success: true, course: course });
    } catch (error) {
        next(error)
    }
}