const NullBatch = require('../classes/NullBatch')
const Batch = require('../classes/Batch')
const BatchBuilder = require('../classes/BatchBuilder')
const batchClass = new Batch()


class BatchService{
    constructor(){}

    async getCourseById(id, select=[], filter={}) {
        return batchClass.findById(id, select, filter);
    }

    async getFindCourse(data = {}, options = {}) {
        const batch = new Batch();

        if(data.name) batch.name = data.name;
        if(data.academic) batch.academic = data.academic;
        if(data.deleted != undefined) batch.deleted = data.deleted;
        if(data.createdAt_timestamp) batch.createdAt_timestamp = data.createdAt_timestamp;
        if(data.updatedAt_timestamp) batch.updatedAt_timestamp = data.updatedAt_timestamp;

        return batch.find(options);
    }

    async createCourse(academic, name){
        const builder = new BatchBuilder();
       
        builder.name = name;
        builder.academic = academic
        return builder.create()
    }

    async deleteCourseById(id){
        return batchClass.deleteById(id);
    }


    async updateCourseById(data={}){
        return batchClass.findByIdAndUpdate(data)
    }

    isNullBatch(batch){
        return batch == NullBatch;
    }
}

module.exports = BatchService;

