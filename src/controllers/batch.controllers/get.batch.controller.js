const BatchService = require('../../services/BatchService')
const service = new BatchService()
const {BatchNotFoundError} = require('../../errors')

module.exports.getBatchById = async(dto, req, res, next)=>{
    try {
        const batch = await service.getBatchById(dto.id, [], {deleted:false})
        if(service.isNullBatch(batch))throw new BatchNotFoundError()
        return res.status(200).json({ success: true, batch: batch });
    } catch (error) {
        next(error)
    }
}

module.exports.getFindBatch = async(dto, req, res, next)=>{
    try {
       
        const data={
            name:dto.name,
            academic:{
                lb:dto.lb,
                ub:dto.ub
            },
            deleted:dto.deleted,
            createdAt_timestamp: dto.createdAt,
            updatedAt_timestamp: dto.updatedAt,
            deleted:false
        }
       
        
        const options = {
            skip:dto.skip,
            limit:dto.limit,
            sort:dto.sort
        }
      
     
        
        const batches = await service.getFindBatch(data, options)
        //if(service.isNullBatch(batch)) throw new BatchNotFoundError()
        return res.status(200).json({ success: true, batches: batches }); 
    } catch (error) {
        next(error)
    }
}
