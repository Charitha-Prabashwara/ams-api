const NullBatch = require('../classes/NullBatch')
const Batch = require('../classes/Batch')
const BatchBuilder = require('../classes/BatchBuilder')
const batchClass = new Batch()


class BatchService{
    constructor(){}

    async getBatchById(id, select=[], filter={}) {
        return batchClass.findById(id, select, filter);
    }

    async getFindBatch(data = {}, options = {}) {
        const batch = new Batch();

        if(data.name) batch.name = data.name;
        
            if(data.academic.lb !=undefined) batch['academic.lb'] = data.academic.lb;
            if(data.academic.ub !=undefined) batch['academic.ub'] = data.academic.ub;
        
        if(data.deleted != undefined) batch.deleted = data.deleted;
        if(data.createdAt_timestamp) batch.createdAt_timestamp = data.createdAt_timestamp;
        if(data.updatedAt_timestamp) batch.updatedAt_timestamp = data.updatedAt_timestamp;
        //console.log(batch);
        
        return batch.find(options);
    }

    async createBatch(academic, name){
        const builder = new BatchBuilder();
       
        builder.name = name;
        builder.academic = academic
        return builder.create()
    }

    async deleteBatchById(id){
        return batchClass.deleteById(id);
    }


    async updateBatchById(data={}){
        return batchClass.findByIdAndUpdate(data)
    }

    isNullBatch(batch){
        return batch == NullBatch;
    }
}

module.exports = BatchService;

