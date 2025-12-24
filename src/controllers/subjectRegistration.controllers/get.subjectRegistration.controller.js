const SubjectRegistrationService = require('../../services/SubjectRegistrationService')
const service = new SubjectRegistrationService()
const {SubjectRegistrationNotFoundError, UserNotFoundError, SemesterNotFoundError, SubjectNotFoundError} = require('../../errors')


module.exports.getSubjectRegistrationById=async(dto, req, res, next)=>{
    try {
        const registration = await service.getById(dto.id)
        if(service.isNullSubjectRegistration(registration)) throw new SubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration }); 
    } catch (error) {
        next(error)
    }
}

module.exports.getFindSubjectRegistrations = async(dto, req, res, next)=>{
    try {
        const {student, semester, subject, isActive, deleted, createdAt, updatedAt, skip, limit, sort} = dto

        const data ={
            student:student,
            semester:semester,
            subject:subject,
            isActive:isActive,
            deleted:deleted,
            createdAt_timestamp:createdAt,
            updatedAt_timestamp:updatedAt
        }

        const options ={
            skip:skip,
            limit:limit,
            sort:sort
        }

        const registrations = await service.getFindRegistration(data, options)
        if(service.isNullSubjectRegistration(registrations)) throw new SubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registrations: registrations });

    } catch (error) {
        next(error)
    }
}