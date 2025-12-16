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

const {CreateSubjectDTO} = require('./subjectDTO/createSubjectDTO')
const {GetSubjectByIdDTO} = require('./subjectDTO/getSubjectByIdDTO')
const {GetSubjectByCodeDTO} = require('./subjectDTO/getSubjectByCodeDTO')
const {GetSubjectFindDTO} = require('./subjectDTO/getSubjectFindDTO')
const {UpdateSubjectByIdDTO} = require('./subjectDTO/updateSubjectByIdDTO')
const {DeleteSubjectByIdDTO} = require('./subjectDTO/deleteSubjectByIdDTO')

const {CreateCourseDTO} = require('./courseDTO/createCourseDTO')
const {UpdateCourseByIdDTO} = require('./courseDTO/updateCourseByIdDTO')
const {GetCourseByIdDTO} = require('./courseDTO/getCourseByIdDTO')
const {GetFindCourseDTO} = require('./courseDTO/getFindCourseDTO')
const {DeleteCourseByIdDTO} = require('./courseDTO/deleteCourseByIdDTO')
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
  CreateSubjectDTO,
  GetSubjectByIdDTO,
  GetSubjectByCodeDTO,
  GetSubjectFindDTO,
  UpdateSubjectByIdDTO,
  DeleteSubjectByIdDTO,
  CreateCourseDTO,
  UpdateCourseByIdDTO,
  GetCourseByIdDTO,
  GetFindCourseDTO,
  DeleteCourseByIdDTO
};
