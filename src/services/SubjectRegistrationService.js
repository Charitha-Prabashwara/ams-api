const NullSubjectRegistration = require('../classes/NullSubjectRegistration')
const SubjectRegistration = require('../classes/SubjectRegistration')
const SubjectRegistrationBuilder = require('../classes/SubjectRegistrationBuilder')
const subjectRegistrationClass = new SubjectRegistration()

class SubjectRegistrationService{

    constructor(){

    }

    async Register(student, semester, subject){

        const builder = new SubjectRegistrationBuilder()
        builder.semester = semester;
        builder.student = student;
        builder.subject = subject;

        return builder.create()

    }

    async getById(id, select=[], filter={}){
        return subjectRegistrationClass.findById(id, select,filter)
    }

    async getFindRegistration(data={}, options={}){
        const finder = new SubjectRegistration()
        if(data.semester) finder.semester = data.semester;
        if(data.student) finder.student = data.student;
        if(data.subject) finder.subject = data.subject;
        if(data.isActive != undefined) finder.isActive = data.isActive;
        if(data.deleted != undefined) finder.deleted = data.deleted;
        if(data.createdAt_timestamp) finder.createdAt_timestamp = data.createdAt_timestamp
        if(data.updatedAt_timestamp) finder.updatedAt_timestamp = data.updatedAt_timestamp

        return finder.find()   
    }

    async getFindOneRegistration(data={}, options={}){
        const finder = new SubjectRegistration()
        if(data.semester) finder.semester = data.semester;
        if(data.student) finder.student = data.student;
        if(data.subject) finder.subject = data.subject;
        if(data.isActive != undefined) finder.isActive = data.isActive;
        if(data.deleted != undefined) finder.deleted = data.deleted;
        if(data.createdAt_timestamp) finder.createdAt_timestamp = data.createdAt_timestamp
        if(data.updatedAt_timestamp) finder.updatedAt_timestamp = data.updatedAt_timestamp

        return finder.findOne(options) 
    }
    
    async updateRegistrationById(data={}, select=[]){
        return subjectRegistrationClass.findByIdAndUpdate(data, select)
    }

    async deleteById(id){
        return subjectRegistrationClass.deleteById(id)
    }

    isNullSubjectRegistration(subjectRegistration){
        return subjectRegistration == NullSubjectRegistration
    }
}

module.exports =SubjectRegistrationService
