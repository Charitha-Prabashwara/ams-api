const NullLecture = require('../classes/NullLecture')
const Lecture = require('../classes/Lecture')
const LectureBuilder = require('../classes/LectureBuilder')
const lectureClass = new Lecture()

class LectureService{
    constructor(){}

    async getLectureById(id, select=[], filter={}){
        return lectureClass.findById(id, select, filter)
    }

    async createNewLecture(data={}){
        const builder = new LectureBuilder()
        builder.topic = data.topic
        builder.lecturer = data.lecturer
        builder.subject = data.subject
        builder.semester = data.semester
        builder.scheduledTime = data.scheduledTime

        return builder.create()
    }

    /**
     * Update an existing lecture by its ID.
     *
     * @async
     * @param {Object} data - Update payload.
     * @param {String} data.id - ID of the subject to update. (required)
     * @param {String} [data.topic] - lecture topic name.
     * @param {String} [data.lecturer] - lecturer id.
     * @param {Number} [data.subject] - Subject id.
     * @param {Boolean} [data.semester] - Semester id.
     * @param {Boolean} [data.scheduledTime] - scheduled time.
     * @param {Boolean} [data.actualStartTime] - actual started time.
     * @param {Boolean} [data.endTime] - actual ended time.
     * @param {Boolean} [data.state] - lecture state.
     * @param {Boolean} [data.deleted] - Update deleted status.
     * @param {Array<string>} [select=[]] - Fields to return after update.
     *
     * @returns {Promise<Object|null>} Updated subject object, or null if not found.
     */
    async updateLectureById(data={}, select=[]){
        return lectureClass.findByIdAndUpdate(data, select)
    }

    async findLecture(data={}, options={}){
        const lecture = new Lecture()

        if(data.topic) lecture.topic = data.topic
        if(data.lecture) lecture.lecturer = data.lecturer
        if(data.subject) lecture.subject = data.subject
        if(data.semester) lecture.semester = data.semester
        if(data.scheduledTime) lecture.scheduledTime = data.scheduledTime
        if(data.actualStartTime) lecture.actualStartTime = data.actualStartTime
        if(data.endTime) lecture.endTime = data.endTime
        if(data.state) lecture.state = data.state
        if(data.deleted != undefined) lecture.deleted = data.deleted
        if(data.createdAt_timestamp) lecture.createdAt_timestamp = data.createdAt_timestamp
        if(data.updatedAt_timestamp) lecture.updatedAt_timestamp = data.updatedAt_timestamp

        return await lecture.find(options)
    }

    async findOneLecture(data={}, options={}){
        const lecture = new Lecture()

        if(data.topic) lecture.topic = data.topic
        if(data.lecturer) lecture.lecturer = data.lecturer
        if(data.subject) lecture.subject = data.subject
        if(data.semester) lecture.semester = data.semester
        if(data.scheduledTime) lecture.scheduledTime = data.scheduledTime
        if(data.actualStartTime) lecture.actualStartTime = data.actualStartTime
        if(data.endTime) lecture.endTime = data.endTime
        if(data.state) lecture.state = data.state
        if(data.deleted != undefined) lecture.deleted = data.deleted
        if(data.createdAt_timestamp) lecture.createdAt_timestamp = data.createdAt_timestamp
        if(data.updatedAt_timestamp) lecture.updatedAt_timestamp = data.updatedAt_timestamp

       return await lecture.findOne(options)

    }

    async deleteLectureById(id){
        return lectureClass.deleteById(id)
    }

    isNullLecture(lecture){
        return lecture == NullLecture
    }
}

module.exports = LectureService;