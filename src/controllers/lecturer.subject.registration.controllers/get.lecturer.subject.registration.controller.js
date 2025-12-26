
const LecturerSubjectRegistrationService = require('../../services/LectureSubjectRegistrationService')
const {LecturerSubjectRegistrationNotFoundError} = require('../../errors')
const service = new LecturerSubjectRegistrationService()


module.exports.getRegistrationById = async(dto, req, res, next)=>{
    try {
        const registration = await service.getRegistrationById(dto.id)
        if(service.isNullLecturerSubjectRegistration(registration)) throw new LecturerSubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration });    
    } catch (error) {
        next(error)
    }
}

module.exports.getFindRegistration = async(dto, req, res, next)=>{
    try {
        
        const data = {
            lecturer: dto.lecturer,
            subject: dto.subject,
            isActive: dto.isActive,
            deleted: dto.deleted,
            createdAt_timestamp: dto.createdAt,
            updatedAt_timestamp: dto.updatedAt
        }

        const options={
            skip:dto.skip,
            limit:dto.limit,
            sort:dto.sort
        }
        const registrations = await service.getFindRegistration(data, options);
        if(service.isNullLecturerSubjectRegistration(registrations)) throw new LecturerSubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registrations: registrations });   
    } catch (error) {
        next(error)
    }
}