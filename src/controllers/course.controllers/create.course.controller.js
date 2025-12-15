const CourseService = require('../../services/CourseService')
const DepartmentService = require('../../services/DepartmentService')
const {DepartmentNotFoundError} = require('../../errors')
const deptService = new DepartmentService()
const service = new CourseService()

module.exports.createCourse = async(dto, req, res, next)=>{
    try {
        const department = await deptService.getDepartmentById(dto.department, [], {deleted:false})
        if(deptService.isNullDepartment(department)) throw new DepartmentNotFoundError()
        const course  = await service.createCourse(dto.code, dto.name, dto.department)
        return res.status(201).json({ success: true, course: course });
    } catch (error) {
        next(error)
    }
}