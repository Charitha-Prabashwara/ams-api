const SemesterService = require('../../services/SemesterService')
const {SemesterNotFoundError} = require('../../errors')
const service = new SemesterService()


module.exports.deleteSemesterById = async(dto, req, res, next)=>{
    try {
        const semester =await service.updateSemesterById({id:dto.id, deleted:true})
        if(service.isNullSemester(semester))throw new SemesterNotFoundError()
        return res.status(200).json({ success: true, semester: semester });    
    } catch (error) {
        next(error)
    }
}