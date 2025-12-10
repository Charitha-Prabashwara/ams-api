const express = require('express');

const { withDTO } = require('../../middleware');
const {
  CreateDepartmentDTO,
  GetDepartmentByIdDTO,
  UpdateDepartmentByIdDTO,
  GetFindDepartmentDTO,
  DeleteDepartmentByIdDTO,
} = require('../../classes/DTO');

const {
  createDepartment,
} = require('../../controllers/department.controllers/create.department.controller');
const {
  getDepartmentById,
  findDepartment,
} = require('../../controllers/department.controllers/get.department.controller');
const {
  updateDepartmentById,
} = require('../../controllers/department.controllers/update.department.controller');
const {
  deleteDepartmentById,
} = require('../../controllers/department.controllers/delete.department.controller');
const departmentRouter = express.Router();

departmentRouter.post('/', withDTO(CreateDepartmentDTO, createDepartment));
departmentRouter.get('/id/', withDTO(GetDepartmentByIdDTO, getDepartmentById));
departmentRouter.get('/find/', withDTO(GetFindDepartmentDTO, findDepartment));
departmentRouter.put(
  '/id/',
  withDTO(UpdateDepartmentByIdDTO, updateDepartmentById),
);
departmentRouter.delete(
  '/id/',
  withDTO(DeleteDepartmentByIdDTO, deleteDepartmentById),
);
module.exports = departmentRouter;
