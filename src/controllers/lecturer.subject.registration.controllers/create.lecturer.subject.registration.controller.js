const LecturerSubjectRegistrationService = require('../../services/LectureSubjectRegistrationService')
const service = new LecturerSubjectRegistrationService()

module.exports.createLectureSubjectRegistration = async(dto, req, res, next)=>{
    try {
        
        const registration = await service.RegisterSubjectAndLecturer(dto.subject, dto.lecturer)
        return res.status(201).json({ success: true, registration: registration });
    } catch (error) {
        next(error)
    }
}