const express = require('express');
const { withDTO } = require('../../middleware');
const {CreateCourseDTO, UpdateCourseByIdDTO, GetCourseByIdDTO, GetFindCourseDTO, DeleteCourseByIdDTO} = require('../../classes/DTO');
const {createCourse} = require('../../controllers/course.controllers/create.course.controller')
const {updateCourseById} = require('../../controllers/course.controllers/update.course.controller')
const {getCourseById, getFindCourse} = require('../../controllers/course.controllers/get.course.controller')
const {deleteCourseById} = require('../../controllers/course.controllers/delete.course.controller')
const corseRouter = express.Router();
corseRouter.post('/', withDTO(CreateCourseDTO, createCourse))
corseRouter.put('/id/', withDTO(UpdateCourseByIdDTO, updateCourseById))
corseRouter.get('/id/', withDTO(GetCourseByIdDTO, getCourseById))
corseRouter.post('/find/', withDTO(GetFindCourseDTO, getFindCourse))
corseRouter.delete('/id/', withDTO(DeleteCourseByIdDTO, deleteCourseById))
module.exports = corseRouter;