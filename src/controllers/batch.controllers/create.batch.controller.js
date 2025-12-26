const BatchService = require('../../services/BatchService')
const service = new BatchService()

module.exports.createBatch = async(dto, req, res, next)=>{
    try {
        const batch = await service.createBatch(
            {lb:dto.lb, ub:dto.ub},
            dto.name
        )
        return res.status(201).json({ success: true, batch: batch });
    } catch (error) {
        next(error)
    }
}