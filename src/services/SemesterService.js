const NullSemester = require('../classes/NullSemester')
const Semester = require('../classes/Semester')
const SemesterBuilder = require('../classes/SemesterBuilder')
const semClass = new Semester()

class SemesterService{

    constructor(){}

    async createNewSemester(data={}){
        const builder = new SemesterBuilder()
        builder.code = data.code;
        builder.name = data.name;
        builder.department = data.department;
        builder.course = data.course;
        builder.batch = data.batch;
        
        return builder.create()
    }

    async updateSemesterById(data={}, select=[]){
        return semClass.findByIdAndUpdate(data, select)
    }

    async findSemester(data={}, options={}){
            const semester = new Semester()
    
            if(data.name) semester.name = data.name;
            if(data.code) semester.code = data.code;
            if(data.department) semester.department = data.department;
            if(data.course) semester.course = data.course;
            if(data.batch) semester.batch = data.batch;
            if(data.isActive != undefined) semester.isActive = data.isActive;
            if(data.deleted != undefined) semester.deleted = data.deleted;
            if(data.createdAt_timestamp) semester.createdAt_timestamp = data.createdAt_timestamp;
            if(data.updatedAt_timestamp) semester.updatedAt_timestamp = data.updatedAt_timestamp;
    
            return await semester.find(options)
    }

    async deleteSemesterById(id){
        return semClass.deleteById(id)
    }

    isNullSemester(semester){
            return semester == NullSemester
    }


}

module.exports = SemesterService