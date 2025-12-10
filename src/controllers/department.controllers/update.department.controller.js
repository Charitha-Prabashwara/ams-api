const DepartmentService = require('../../services/DepartmentService');
const { DepartmentNotFoundError } = require('../../errors');
const deptService = new DepartmentService();

exports.updateDepartmentById = async (dto, req, res, next) => {
  try {
    const data = {
      id: dto.id,
      name: {
        long: dto.longName,
        short: dto.shortName,
        key: dto.keyName,
      },
      description: dto.description,
      deleted: dto.deleted,
    };
    const dept = await deptService.updateDepartmentById(data);
    if (deptService.isNullDepartment(dept)) throw new DepartmentNotFoundError();
    return res.status(200).json({ success: true, dept: dept });
  } catch (error) {
    next(error);
  }
};
