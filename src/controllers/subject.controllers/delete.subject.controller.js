const SubjectService = require('../../services/SubjectService')
const {SubjectNotFoundError} = require('../../errors')
const service = new SubjectService()

exports.deleteSubjectById = async(dto, req, res, next)=>{
    try {
        const subject = await service.updateSubjectById({id:dto.id, deleted:true})
        if(service.isNullSubject(subject))throw new SubjectNotFoundError()
        return res.status(200).json({ success: true, subject: subject });
    } catch (error) {
        next(error)
    }
}
