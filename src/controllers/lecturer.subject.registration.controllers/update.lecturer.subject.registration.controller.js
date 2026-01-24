const LecturerSubjectRegistrationService = require('../../services/LectureSubjectRegistrationService')
const {LecturerSubjectRegistrationNotFoundError} = require('../../errors')
const service = new LecturerSubjectRegistrationService()

module.exports.updateRegistrationById = async(dto, req, res, next)=>{
    try {
        const data={
            id:dto.id,
            lecturer:dto.lecturer,
            subject:dto.subject,
            isActive:dto.isActive,
            deleted:dto.deleted
        }
        const registration =await service.updateRegistrationById(data)
        if(service.isNullLecturerSubjectRegistration(registration)) throw new LecturerSubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration });
    } catch (error) {
        next(error)
    }
}