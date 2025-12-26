const express = require('express');

const { withDTO } = require('../../middleware');
  
const {CreateSubjectRegistrationDTO, GetSubjectRegistrationByIdDTO, UpdateSubjectRegistrationByIdDTO, GetFindSubjectRegistrationByIdDTO,DeleteSubjectRegistrationByIdDTO} = require('../../classes/DTO');
const {createSubjectRegistration} = require('../../controllers/subjectRegistration.controllers/createSubjectRegistration.controller')
const {getSubjectRegistrationById, getFindSubjectRegistrations} = require('../../controllers/subjectRegistration.controllers/get.subjectRegistration.controller')
const {updateSubjectRegistrationById} = require('../../controllers/subjectRegistration.controllers/update.subjectRegistration.controller')
const subjectRegistrationRouter = express.Router()

subjectRegistrationRouter.post('/', withDTO(CreateSubjectRegistrationDTO, createSubjectRegistration))
subjectRegistrationRouter.get('/id/', withDTO(GetSubjectRegistrationByIdDTO, getSubjectRegistrationById))
subjectRegistrationRouter.put('/id/', withDTO(UpdateSubjectRegistrationByIdDTO, updateSubjectRegistrationById))
subjectRegistrationRouter.get('/find/', withDTO(GetFindSubjectRegistrationByIdDTO, getFindSubjectRegistrations))
subjectRegistrationRouter.delete('/id/', withDTO(DeleteSubjectRegistrationByIdDTO, getFindSubjectRegistrations))
module.exports = subjectRegistrationRouter