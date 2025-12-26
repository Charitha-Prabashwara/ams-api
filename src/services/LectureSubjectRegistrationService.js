const LecturerSubjectRegistration = require('../classes/LecturerSubjectRegistration')
const LecturerSubjectRegistrationBuilder = require('../classes/LecturerSubjectRegistrationBuilder')
const NullLecturerSubjectRegistration = require('../classes/NullLecturerSubjectRegistration')
const lecturerSubjectRegistrationClass = new LecturerSubjectRegistration()
class LecturerSubjectRegistrationService{
    constructor(){}

    async RegisterSubjectAndLecturer(subject, lecture){
        const builder = new LecturerSubjectRegistrationBuilder()
        builder.subject = subject
        builder.lecturer = lecture
        return builder.create()
    }

    async getRegistrationById(id){
        return lecturerSubjectRegistrationClass.findById(id)
    }

    async getFindRegistration(data={}, options={}){
        const finder = new LecturerSubjectRegistration()
        if(data.subject) finder.subject = data.subject;
        if(data.lecturer) finder.lecturer = data.lecturer;
        if(data.isActive != undefined) finder.isActive = data.isActive;
        if(data.deleted != undefined) finder.deleted = data.deleted;
        if(data.updatedAt_timestamp) finder.updatedAt_timestamp = data.updatedAt_timestamp;
        if(data.createdAt_timestamp) finder.createdAt_timestamp = data.createdAt_timestamp;

        return finder.find(options)

    }

    async updateRegistrationById(data={}){
        return lecturerSubjectRegistrationClass.findByIdAndUpdate(data);
    }

    async deleteRegistrationById(id){
        return lecturerSubjectRegistrationClass.deleteById(id)
    }

    isNullLecturerSubjectRegistration(registration){
        return registration == NullLecturerSubjectRegistration
    }
    
    
}

module.exports= LecturerSubjectRegistrationService