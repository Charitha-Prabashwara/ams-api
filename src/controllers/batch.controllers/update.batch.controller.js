const BatchService = require('../../services/BatchService')
const {BatchNotFoundError} = require('../../errors')
const service = new BatchService()


module.exports.updateBatchById = async(dto, req, res, next)=>{
    try {
        const data ={
            id:dto.id,
            name:dto.name,
            academic:{lb:dto.lb,ub:dto.ub},
            deleted:dto.deleted
        }
        const batch = await service.updateBatchById(data)
        if(service.isNullBatch(batch))throw new BatchNotFoundError()
        return res.status(200).json({ success: true, batch: batch });   
    } catch (error) {
        next(error)
    }
}