const LectureService = require('../../services/LectureService')
const {LectureNotFoundError} = require('../../errors')
const service = new LectureService()

module.exports.getLectureById = async(dto, req, res, next)=>{
    try {
        const id = dto.id
        const scheduledLecture = await service.getLectureById(id)
        if(service.isNullLecture(scheduledLecture)) throw new LectureNotFoundError()
        return res.status(201).json({ success: true, lecture: scheduledLecture });
    } catch (error) {
        next(error)
    }
}

module.exports.getFindLecture = async(dto, req, res, next)=>{
    try {
        
        const data = {
            topic:dto.topic,
            lecturer:dto.lecturer,
            subject:dto.subject,
            semester:dto.semester,
            scheduledTime:dto.scheduledTime,
            actualStartTime:dto.actualStartTime,
            endTime:dto.endTime,
            state:dto.state,
            deleted:dto.deleted,
            createdAt_timestamp: dto.createdAt,
            updatedAt_timestamp: dto.updatedAt
        }

        const options={
            skip:dto.skip,
            limit:dto.limit,
            sort:dto.sort
        }
        const scheduledLectures = await service.findLecture(data, options);
        if(service.isNullLecture(scheduledLectures)) throw new LectureNotFoundError()
        return res.status(200).json({ success: true, lecture: scheduledLectures });   
    } catch (error) {
        next(error)
    }
}