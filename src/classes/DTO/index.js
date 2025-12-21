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

const {CreateSemesterDTO} = require('./semesterDTO/createSemesterDTO')
const {GetSemesterByIdDTO} = require('./semesterDTO/getSemesterByIdDTO')
const {GetSemesterByCodeDTO} = require('./semesterDTO/getSemesterByCodeDTO')

const {CreateBatchDTO} = require('./batchDTO/createBatchDTO')
const {GetBatchByIdDTO} = require('./batchDTO/getBatchByIdDTO')
const {UpdateBatchByIdDTO} = require('./batchDTO/updateBatchByIdDTO')
const {GetFindBatchDTO} = require('./batchDTO/getFindBatchDTO')
const {DeleteBatchByIdDTO} = require('./batchDTO/deleteBatchByIdDTO')
const {GetFindSemesterDTO} = require('./semesterDTO/getFindSemesterDTO')
const {UpdateSemesterByIdDTO} = require('./semesterDTO/updateSemesterByIdDTO')
const {DeleteSemesterByIdDTO} = require('./semesterDTO/deleteSemesterByIdDTO')
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
  DeleteCourseByIdDTO,
  CreateSemesterDTO,
  CreateBatchDTO,
  GetBatchByIdDTO,
  UpdateBatchByIdDTO,
  GetFindBatchDTO,
  DeleteBatchByIdDTO,
  GetSemesterByIdDTO,
  GetSemesterByCodeDTO,
  GetFindSemesterDTO,
  UpdateSemesterByIdDTO,
  DeleteSemesterByIdDTO
  
};
