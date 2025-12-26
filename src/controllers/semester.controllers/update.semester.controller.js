const SemesterService = require('../../services/SemesterService')
const DepartmentService = require('../../services/DepartmentService')
const CourseService = require('../../services/CourseService');
const BatchService = require('../../services/BatchService')
const {SemesterNotFoundError, DepartmentNotFoundError, CourseNotFoundError, BatchNotFoundError} = require('../../errors')
const service = new SemesterService()
const departmentService = new DepartmentService()
const courseService = new CourseService()
const batchService = new BatchService()

module.exports.updateSemesterById = async(dto, req, res, next)=>{
    try {
        let department, course, batch

        if(dto.department){
            department = await departmentService.getDepartmentById(dto.department)
            if(departmentService.isNullDepartment(department))throw new DepartmentNotFoundError()
        }

    

        if(dto.course){
            course = await courseService.getCourseById(dto.course)
            if(courseService.isNullCourse(course)) throw new CourseNotFoundError()

            
        }

            if(dto.batch){
            batch = await batchService.getBatchById(dto.batch)
            if(batchService.isNullBatch(batch)) throw new BatchNotFoundError()
        }

        if(course.department != department.id){
            throw new Error("Your selected department" + department.name.short + "is not belongs to course: " + course.name)
        }
        
        const data={
        id:dto.id,
        code:dto.code,
        name:dto.name,
        department:dto.department,
        course:dto.course,
        batch:dto.batch,
        active:dto.isActive,
        deleted:dto.deleted,
        }


        const semester = await service.updateSemesterById(data)
        if(service.isNullSemester(semester))throw new SemesterNotFoundError()
        return res.status(200).json({ success: true, semesters: semester });     
    } catch (error) {
        next(error)
    }
}