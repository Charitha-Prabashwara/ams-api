const express = require('express');

const { withDTO } = require('../../middleware');
  
const {CreateSubjectDTO, GetSubjectByIdDTO, GetSubjectByCodeDTO, GetSubjectFindDTO, UpdateSubjectByIdDTO} = require('../../classes/DTO');
const {createNewSubject} = require('../../controllers/subject.controllers/create.subject.controller')
const {getSubjectById, getSubjectByCode, getFindSubject} = require('../../controllers/subject.controllers/get.subject.controller')
const {updateSubjectById} = require('../../controllers/subject.controllers/update.subject.controller')
const subjectRouter = express.Router()

subjectRouter.post('/', withDTO(CreateSubjectDTO, createNewSubject))
subjectRouter.get('/id/', withDTO(GetSubjectByIdDTO, getSubjectById))
subjectRouter.get('/code/', withDTO(GetSubjectByCodeDTO, getSubjectByCode))
subjectRouter.get('/find/', withDTO(GetSubjectFindDTO, getFindSubject))
subjectRouter.put('/id/', withDTO(UpdateSubjectByIdDTO, updateSubjectById))
module.exports = subjectRouter