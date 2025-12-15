const CourseService = require('../../services/CourseService')
const DepartmentService = require('../../services/DepartmentService')
const {DepartmentNotFoundError, CourseNotFoundError} = require('../../errors')
const deptService = new DepartmentService()
const service = new CourseService()


module.exports.getCourseById = async(dto, req, res, next)=>{
    try {
        const course =await service.getCourseById(dto.id)
        if(service.isNullCourse(course)) throw new CourseNotFoundError()
        return res.status(200).json({ success: true, course: course });
    } catch (error) {
        next(error)
    }
}

module.exports.getFindCourse = async(dto, req, res, next)=>{
    try {
          
               const data ={
                   id: dto.id,
                   code: dto.code,
                   name: dto.name,
                   isActive:dto.isActive,
                   deleted:dto.deleted,
                   department: dto.department,
                   createdAt_timestamp: dto.createdAt,
                   updatedAt_timestamp: dto.updatedAt
               }

               const options = {
                    skip:dto.skip,
                    limit:dto.limit,
                    sort:dto.sort
               }

               const courses = await service.getFindCourse(data, {});
             
               
              courses.forEach((course) => {
                if (service.isNullCourse(course)){
                    
                } 
              });
            
                return res.status(200).json({ success: true, courses: courses });

    } catch (error) {
        next(error)
    }
}