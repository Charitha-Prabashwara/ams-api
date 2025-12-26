const SubjectRegistrationService = require('../../services/SubjectRegistrationService')
const service = new SubjectRegistrationService()
const {SubjectRegistrationNotFoundError} = require('../../errors')


module.exports.deleteSubjectRegistrationById = async(dto, req, res, next)=>{
    try {
        const registration = await service.deleteById(dto.id)
        if(service.isNullSubjectRegistration(registration))throw new SubjectRegistrationNotFoundError()
        return res.status(200).json({ success: true, registration: registration });    
    } catch (error) {
        next(error)
    }
}