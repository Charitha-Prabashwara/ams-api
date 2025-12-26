const LecturerSubjectRegistrationService = require('../../services/LectureSubjectRegistrationService')
const {LecturerSubjectRegistrationNotFoundError} = require('../../errors')
const service = new LecturerSubjectRegistrationService()

module.exports.deleteRegistrationById = async(dto, req, res, next)=>{
    try {
       
        const registration =await service.deleteRegistrationById(dto.id)
        if(service.isNullLecturerSubjectRegistration(registration)) throw new LecturerSubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration });
    } catch (error) {
        next(error)
    }
}