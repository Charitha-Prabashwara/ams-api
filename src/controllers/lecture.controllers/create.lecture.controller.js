const LectureService = require('../../services/LectureService')
const service = new LectureService()

module.exports.createLecture = async(dto, req, res, next)=>{
    try {
        const data = {
            topic: dto.topic,
            lecturer: dto.lecturer,
            subject: dto.subject,
            semester: dto.semester,
            scheduledTime: dto.scheduledTime
        }
        const scheduledLecture = await service.createNewLecture(data)
        return res.status(201).json({ success: true, lecture: scheduledLecture });
    } catch (error) {
        next(error)
    }
}