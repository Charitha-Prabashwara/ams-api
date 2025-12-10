const { CreateUserDTO } = require('./userDTO/createUserDTO');
const { ErrorResponseDTO } = require('./errorResponseDTO');
const { GetUserByIdDTO } = require('./userDTO/getUserByIdDTO');
const {
  GetUserByRegistrationIdDTO,
} = require('./userDTO/getUserByRegistrationId');
const { getUserByEmailDTO } = require('./userDTO/getUserByEmail');
const { UpdateUserByIdDTO } = require('./userDTO/updateUserByIdDTO');
const { GetUserFindDTO } = require('./userDTO/getUserFindDTO');
const {
  GetDepartmentByIdDTO,
} = require('./departmentDTO/getDepartmentByIdDTO');
const { CreateDepartmentDTO } = require('./departmentDTO/createDepartmentDTO');
const {
  UpdateDepartmentByIdDTO,
} = require('./departmentDTO/updateDepartmentByIdDTO');
const {
  GetFindDepartmentDTO,
} = require('./departmentDTO/getFindDepartmentDTO');
const {
  DeleteDepartmentByIdDTO,
} = require('./departmentDTO/deleteDepartmentByIdDTO');
module.exports = {
  CreateUserDTO,
  ErrorResponseDTO,
  GetUserByIdDTO,
  GetUserByRegistrationIdDTO,
  getUserByEmailDTO,
  UpdateUserByIdDTO,
  GetUserFindDTO,
  CreateDepartmentDTO,
  GetDepartmentByIdDTO,
  UpdateDepartmentByIdDTO,
  GetFindDepartmentDTO,
  DeleteDepartmentByIdDTO,
};
