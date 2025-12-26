const express = require('express');
const { withDTO } = require('../../middleware');
const {CreateSemesterDTO, GetSemesterByIdDTO, GetSemesterByCodeDTO, GetFindSemesterDTO, UpdateSemesterByIdDTO, DeleteSemesterByIdDTO} = require('../../classes/DTO');
const {createSemester} = require('../../controllers/semester.controllers/create.semester.controller')
const {getSemesterById, getSemesterByCode, getFindSemester} = require('../../controllers/semester.controllers/get.semester.controller')
const {updateSemesterById}  =require('../../controllers/semester.controllers/update.semester.controller')
const {deleteSemesterById} = require('../../controllers/semester.controllers/delete.semester.controller')
const semesterRouter = express.Router();

semesterRouter.post('/', withDTO(CreateSemesterDTO, createSemester))
semesterRouter.get('/id/', withDTO(GetSemesterByIdDTO, getSemesterById))
semesterRouter.get('/code/', withDTO(GetSemesterByCodeDTO, getSemesterByCode))
semesterRouter.get('/find/', withDTO(GetFindSemesterDTO, getFindSemester))
semesterRouter.put('/id/', withDTO(UpdateSemesterByIdDTO, updateSemesterById))
semesterRouter.delete('/id/', withDTO(DeleteSemesterByIdDTO, deleteSemesterById))
module.exports = semesterRouter;