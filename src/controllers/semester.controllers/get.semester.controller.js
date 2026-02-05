const SemesterService = require('../../services/SemesterService')
const {SemesterNotFoundError} = require('../../errors')
const service = new SemesterService()

module.exports.getSemesterById = async(dto, req, res, next)=>{
    const semester =await service.getSemesterById(dto.id, [], {deleted:false})
    if(service.isNullSemester(semester)) throw new SemesterNotFoundError()
    return res.status(200).json({ success: true, semester: semester }); 
}

module.exports.getSemesterByCode = async(dto, req, res, next)=>{
    if(dto.code=="" || dto.code==undefined) throw new SemesterNotFoundError()
    const semesters = await service.findOneSemester({code:dto.code, deleted:false})
    if(service.isNullSemester(semesters)) throw new SemesterNotFoundError()
    return res.status(200).json({ success: true, semester: semesters }); 
}

module.exports.getFindSemester = async(dto, req, res, next)=>{

    try {
        const data={
            code:dto.code,
            name:dto.name,
            department:dto.department,
            course:dto.course,
            batch:dto.batch,
            active:dto.isActive,
            deleted:dto.deleted,
            createdAt_timestamp:dto.createdAt,
            updatedAt_timestamp:dto.updatedAt,
            deleted:false
        }
        const options={
            skip:dto.skip,
            limit:dto.limit,
            sort:dto.sort
        }
        const semesters = await service.findSemester(data, options)
        if(service.isNullSemester(semesters))throw new SemesterNotFoundError()
        return res.status(200).json({ success: true, semesters: semesters });  
    } catch (error) {
        next(error)
    }
}