const LectureService = require('../../services/LectureService')
const {LectureNotFoundError} = require('../../errors')
const service = new LectureService()


module.exports.deleteLectureById = async(dto, req, res, next)=>{
 try {
        const id = dto.id
        const scheduledLecture = await service.deleteLectureById(id)
        if(service.isNullLecture(scheduledLecture)) throw new LectureNotFoundError()
        return res.status(201).json({ success: true, lecture: scheduledLecture });
    } catch (error) {
        next(error)
    }
}