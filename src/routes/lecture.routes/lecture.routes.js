const express = require('express');
const { withDTO } = require('../../middleware');
const {CreateLectureDTO, GetLectureByIdDTO, UpdateLectureByIdDTO, GetFindLectureDTO, DeleteLectureByIdDTO} = require('../../classes/DTO');
const {createLecture}  = require('../../controllers/lecture.controllers/create.lecture.controller')
const {getLectureById, getFindLecture} = require('../../controllers/lecture.controllers/get.lecture.controller')
const {updateLectureById} = require('../../controllers/lecture.controllers/update.lecture.controller')
const {deleteLectureById} = require('../../controllers/lecture.controllers/delete.lecture.controller')
const lectureRouter = express.Router();

lectureRouter.post('/', withDTO(CreateLectureDTO, createLecture))
lectureRouter.post('/id/', withDTO(GetLectureByIdDTO, getLectureById))
lectureRouter.put('/id/', withDTO(UpdateLectureByIdDTO, updateLectureById))
lectureRouter.delete('/id/', withDTO(DeleteLectureByIdDTO, deleteLectureById))
lectureRouter.post('/find/', withDTO(GetFindLectureDTO, getFindLecture))

module.exports = lectureRouter;