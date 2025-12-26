const SemesterService = require('../../services/SemesterService')
const DepartmentService = require('../../services/DepartmentService')
const CourseService = require('../../services/CourseService');
const BatchService = require('../../services/BatchService')
const {DepartmentNotFoundError, CourseNotFoundError, BatchNotFoundError} = require('../../errors');
const { ne } = require('@faker-js/faker');
const service = new SemesterService()
const departmentService = new DepartmentService()
const courseService = new CourseService()
const batchService = new BatchService()


module.exports.createSemester = async(dto, req, res, next)=>{

    try {
        const {department, course, batch, code, name} = dto

        const [getDepartment, getCourse, getBatch] =await Promise.all([
            departmentService.getDepartmentById(department),
            courseService.getCourseById(course),
            batchService.getBatchById(batch)
        ])

        if(departmentService.isNullDepartment(getDepartment))throw new DepartmentNotFoundError()
        if(courseService.isNullCourse(getCourse)) throw new CourseNotFoundError()
        if(batchService.isNullBatch(getBatch)) throw new BatchNotFoundError()

        if(getCourse.department != department){
            throw new Error("Your selected department" + getDepartment.name.short + "is not belongs to course: " + getCourse.name)
        }

        const data={
            code:code,
            name:name,
            department: department,
            course:course,
            batch:batch
        }

        const semester = await service.createNewSemester(data)
        return res.status(201).json({ success: true, semester: semester }); 
    } catch (error) {
        next(error)
    }



    
   


    
    

}