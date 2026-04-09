const LectureService = require('../../services/LectureService')
const {LectureNotFoundError} = require('../../errors')
const service = new LectureService()

module.exports.updateLectureById = async(dto, req, res, next)=>{
    try {
        const data={
            id:dto.id,
            topic:dto.topic,
            lecturer:dto.lecturer,
            subject:dto.subject,
            semester:dto.semester,
            scheduledTime:dto.scheduledTime,
            actualStartTime:dto.actualStartTime,
            endTime:dto.endTime,
            state:dto.state,
            deleted:dto.deleted

        }
        
        const scheduledLecture =await service.updateLectureById(data, [])
        if(service.isNullLecture(scheduledLecture)) throw new LectureNotFoundError()
        return res.status(200).json({ success: true, lecture: scheduledLecture });
    } catch (error) {
        next(error)
    }
}