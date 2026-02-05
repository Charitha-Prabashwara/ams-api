const BatchService = require('../../services/BatchService')
const service = new BatchService()
const {BatchNotFoundError} = require('../../errors')

module.exports.deleteBatchById = async(dto, req, res, next)=>{
    try {
        const batch = await service.updateBatchById({id:dto.id, deleted:true})
        if(service.isNullBatch(batch))throw new BatchNotFoundError()
        return res.status(200).json({ success: true, batch: batch });
    } catch (error) {
        next(error)
    }
}