const SubjectService = require('../../services/SubjectService')
const UserService = require('../../services/UserService');
const SemesterService = require('../../services/SemesterService')
const SubjectRegistrationService = require('../../services/SubjectRegistrationService')
const {UserNotFoundError, SemesterNotFoundError, SubjectNotFoundError} = require('../../errors')
const subjectService = new SubjectService()
const userService = new UserService()
const semesterService = new SemesterService()
const service = new SubjectRegistrationService()

const {userTypes} = require('../../config')

module.exports.createSubjectRegistration = async(dto, req, res, next)=>{
    
    try {
        const {student, semester, subject} = dto

        const [getUser, getSemester, getSubject] =await Promise.all([
                userService.getUserById(userTypes.USER_STUDENT, student,[], {deleted:false}),
                semesterService.getSemesterById(semester, [], {deleted:false, isActive:true}),
                subjectService.getSubjectById(subject, [], {deleted:false, isActive:true})
        ])

        if(userService.isNullUser(getUser))throw new UserNotFoundError()
        if(semesterService.isNullSemester(getSemester)) throw new SemesterNotFoundError()
        if(subjectService.isNullSubject(getSubject)) throw new SubjectNotFoundError()

        const registration = await service.Register(getUser.id, getSemester.id, getSubject.id)
        return res.status(201).json({ success: true, subjectRegistration: registration}); 
    } catch (error) {
        next(error)
    }
}