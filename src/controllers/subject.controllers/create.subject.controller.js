const SubjectService = require('../../services/SubjectService')
const service = new SubjectService()

exports.createNewSubject = async(dto, req, res, next)=>{
    try {
        const data = {
            code:dto.code,
            name:dto.name,
            credits:dto.credits
        }
        const subject = await service.createNewSubject(data)
        return res.status(201).json({ success: true, subject: subject });
    } catch (error) {
        next(error)
    }
}