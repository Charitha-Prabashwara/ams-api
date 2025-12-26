const CourseService = require('../../services/CourseService')
const DepartmentService = require('../../services/DepartmentService')
const {DepartmentNotFoundError, CourseNotFoundError} = require('../../errors')
const deptService = new DepartmentService()
const service = new CourseService()


module.exports.updateCourseById = async(dto, req, res, next)=>{

    try {
        const getDepartment = async(departmentId)=>{
            const department = await deptService.getDepartmentById(departmentId, [], {deleted:false});
            if(deptService.isNullDepartment(department)) throw new DepartmentNotFoundError()
            return department
        }
        const data ={
            id: dto.id,
            code: dto.code,
            name: dto.name,
            isActive:dto.isActive,
            deleted:dto.deleted
        }

        if(dto.department){
            data.department = await getDepartment(dto.department).id
        }

        const course = await service.updateCourseById(data)
        if(service.isNullCourse(course)) throw new CourseNotFoundError()
        return res.status(200).json({ success: true, course: course });
    } catch (error) {
        next(error)
    }

}