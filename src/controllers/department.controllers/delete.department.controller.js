const DepartmentService = require('../../services/DepartmentService');
const { DepartmentNotFoundError } = require('../../errors');
const deptService = new DepartmentService();

exports.deleteDepartmentById = async (dto, req, res, next) => {
  try {
    const safeDelete = async () => {
      return deptService.updateDepartmentById({ id: dto.id, deleted: true });
    };
    const unsafeDelete = async () => {
      //return deptService.deleteDepartmentById(dto.id);
      return deptService.updateDepartmentById({ id: dto.id, deleted: true });
    };

    const selectMode = async (safe) => {
      if (safe) return safeDelete();
      return unsafeDelete();
    };

    const dept = await selectMode(dto.safe);
    if (deptService.isNullDepartment(dept)) throw new DepartmentNotFoundError();
    return res.status(200).json({ success: true, department: dept });
  } catch (error) {
    next(error);
  }
};
