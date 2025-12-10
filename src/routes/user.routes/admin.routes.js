const express = require('express');
const {
  create,
} = require('../../controllers/user.contollers/user.admin.controllers/create.user.controller');
const {
  getUserById,
  getUserByRegistrationId,
  getUserByEmailId,
  allUsers,
} = require('../../controllers/user.contollers/user.admin.controllers/get.user.controller');
const {
  updateById,
} = require('../../controllers/user.contollers/user.admin.controllers/update.user.controller');
const {
  userDeleteById,
} = require('../../controllers/user.contollers/user.admin.controllers/delete.user.controller');
const { withDTO } = require('../../middleware');
const {
  CreateUserDTO,
  GetUserByIdDTO,
  GetUserByRegistrationIdDTO,
  getUserByEmailDTO,
  UpdateUserByIdDTO,
  GetUserFindDTO,
} = require('../../classes/DTO');

const adminRouter = express.Router();
adminRouter.post('/', withDTO(CreateUserDTO, create));
adminRouter.get('/id/', withDTO(GetUserByIdDTO, getUserById));
adminRouter.get(
  '/reg/',
  withDTO(GetUserByRegistrationIdDTO, getUserByRegistrationId),
);
adminRouter.get('/email/', withDTO(getUserByEmailDTO, getUserByEmailId));

adminRouter.put('/id/', withDTO(UpdateUserByIdDTO, updateById));
adminRouter.delete('/id/', withDTO(GetUserByIdDTO, userDeleteById));

adminRouter.get('/find/', withDTO(GetUserFindDTO, allUsers));
module.exports = adminRouter;
