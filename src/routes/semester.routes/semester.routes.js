const express = require('express');
const { withDTO } = require('../../middleware');
const {CreateSemesterDTO} = require('../../classes/DTO');
const {createSemester} = require('../../controllers/semester.controllers/create.semester.controller')
const semesterRouter = express.Router();

semesterRouter.post('/', withDTO(CreateSemesterDTO, createSemester))

module.exports = semesterRouter;