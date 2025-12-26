const express = require('express');
const { withDTO } = require('../../middleware');
  
const {CreateLectureSubjectRegistrationDTO, GetLectureSubjectRegistrationByIdDTO, GetFindSubjectRegistrationByIdDTO, UpdateLectureSubjectRegistrationDTO, DeleteLectureSubjectRegistrationByIdDTO} = require('../../classes/DTO');
const {createLectureSubjectRegistration} = require('../../controllers/lecturer.subject.registration.controllers/create.lecturer.subject.registration.controller')
const {getRegistrationById, getFindRegistration} = require('../../controllers/lecturer.subject.registration.controllers/get.lecturer.subject.registration.controller')
const {updateRegistrationById} = require('../../controllers/lecturer.subject.registration.controllers/update.lecturer.subject.registration.controller')
const {deleteRegistrationById} = require('../../controllers/lecturer.subject.registration.controllers/delete.lecturer.subject.registration.controller')
const lecturerSubjectRegistrationRouter = express.Router()

lecturerSubjectRegistrationRouter.post('/', withDTO(CreateLectureSubjectRegistrationDTO, createLectureSubjectRegistration))
lecturerSubjectRegistrationRouter.get('/id/', withDTO(GetLectureSubjectRegistrationByIdDTO, getRegistrationById))
lecturerSubjectRegistrationRouter.get('/find/', withDTO(GetFindSubjectRegistrationByIdDTO, getFindRegistration))
lecturerSubjectRegistrationRouter.put('/id/', withDTO(UpdateLectureSubjectRegistrationDTO, updateRegistrationById))
lecturerSubjectRegistrationRouter.delete('/id/', withDTO(DeleteLectureSubjectRegistrationByIdDTO, deleteRegistrationById))

module.exports = lecturerSubjectRegistrationRouter