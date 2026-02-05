const SubjectService = require('../../services/SubjectService')
const {SubjectNotFoundError} = require('../../errors')
const service = new SubjectService()

exports.getSubjectById = async(dto, req, res, next)=>{
    try {
        const subject = await service.getSubjectById(dto.id, [], {deleted:false})
        if(service.isNullSubject(subject)) throw new SubjectNotFoundError()
        return res.status(200).json({ success: true, subject: subject });
    } catch (error) {
        next(error)
    }
}

exports.getSubjectByCode = async(dto, req, res, next)=>{
    try {
        const subjects = await service.findSubject({code:dto.code, deleted:false}, {limit:1})
        if(service.isNullSubject(subjects[0])) throw new SubjectNotFoundError()
        return res.status(200).json({ success: true, subject: subjects[0] });
    } catch (error) {
        next(error)
    }
}

exports.getFindSubject = async(dto, req, res, next)=>{
    try {
        const data={
            name: dto.name,
            code: dto.code,
            credits: dto.credits,
            deleted: dto.deleted,
            createdAt_timestamp: dto.createdAt,
            updatedAt_timestamp: dto.updatedAt,
            deleted:false

        }
        const options={
            skip:dto.skip,
            limit:dto.limit,
            sort:dto.sort
        }
        const subjects = await service.findSubject(data,options)
        subjects.forEach(subject => {if(service.isNullSubject(subject))throw new SubjectNotFoundError()});
        return res.status(200).json({ success: true, subjects: subjects });
    } catch (error) {
        next(error)
    }
}