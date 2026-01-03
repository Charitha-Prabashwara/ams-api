const express = require('express');
const { withDTO } = require('../../middleware');
const {CreateBatchDTO, GetBatchByIdDTO, UpdateBatchByIdDTO, GetFindBatchDTO, DeleteBatchByIdDTO} = require('../../classes/DTO');
const {createBatch}  = require('../../controllers/batch.controllers/create.batch.controller')
const {getBatchById, getFindBatch} = require('../../controllers/batch.controllers/get.batch.controller')
const {updateBatchById} = require('../../controllers/batch.controllers/update.batch.controller')
const {deleteBatchById} = require('../../controllers/batch.controllers/delete.batch.controller')
const batchRouter = express.Router();
batchRouter.post('/', withDTO(CreateBatchDTO, createBatch))
batchRouter.get('/id/', withDTO(GetBatchByIdDTO, getBatchById))
batchRouter.put('/id/', withDTO(UpdateBatchByIdDTO, updateBatchById))
batchRouter.delete('/id/', withDTO(DeleteBatchByIdDTO, deleteBatchById))
batchRouter.post('/find/', withDTO(GetFindBatchDTO, getFindBatch))

module.exports = batchRouter;