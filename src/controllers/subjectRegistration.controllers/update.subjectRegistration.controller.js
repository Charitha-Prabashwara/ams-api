

const {userTypes} = require('../../config')
const SubjectService = require('../../services/SubjectService')
const UserService = require('../../services/UserService');
const SemesterService = require('../../services/SemesterService')
const SubjectRegistrationService = require('../../services/SubjectRegistrationService')
const service = new SubjectRegistrationService()
const {SubjectRegistrationNotFoundError, UserNotFoundError, SemesterNotFoundError, SubjectNotFoundError} = require('../../errors')
const subjectService = new SubjectService()
const userService = new UserService()
const semesterService = new SemesterService()

module.exports.updateSubjectRegistrationById = async(dto, req, res, next)=>{
    try {
        const {student, semester, subject, id, isActive, deleted} = dto

       

        if(student){
            const getStudent = await userService.getUserById(userTypes.USER_STUDENT, student,[], {deleted:false})
            if(userService.isNullUser(getStudent))throw new UserNotFoundError()
        }

        if(semester){
            const getSemester = await semesterService.getSemesterById(semester, [], {deleted:false})
             if(semesterService.isNullSemester(getSemester)) throw new SemesterNotFoundError()
        }

        if(subject){
            const getSubject = await  subjectService.getSubjectById(subject, [], {deleted:false})
            if(subjectService.isNullSubject(getSubject)) throw new SubjectNotFoundError()
        }


        
       
      

        const data ={
            id:id,
            semester:semester,
            subject:subject,
            student:student,
            isActive: isActive,
            deleted:deleted
        }
        const registration = await service.updateRegistrationById(data)
        if(service.isNullSubjectRegistration(registration)) throw new SubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration });
    } catch (error) {
        next(error)
    }
}