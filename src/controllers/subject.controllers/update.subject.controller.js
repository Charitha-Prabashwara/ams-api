const SubjectService = require('../../services/SubjectService')
const {SubjectNotFoundError} = require('../../errors')
const service = new SubjectService()

exports.updateSubjectById = async(dto, req, res, next)=>{

    try {
        const data={
        id:dto.id,
        name:dto.name,
        code:dto.code,
        credits:dto.credits,
        deleted:dto.deleted
        }
        const subject = await service.updateSubjectById(data)
        if(service.isNullSubject(subject))throw new SubjectNotFoundError()
        return res.status(200).json({ success: true, subject: subject });
    } catch (error) {
        next(error)
    }
}