const DepartmentService = require('../../services/DepartmentService');
const deptService = new DepartmentService();

exports.createDepartment = async (dto, req, res, next) => {
  try {
    const name = { long: dto.longName, short: dto.shortName, key: dto.keyName };
    const department = await deptService.createDepartment(
      name,
      dto.description,
    );

    return res.status(201).json({ success: true, department: department });
  } catch (error) {
    next(error);
  }
};
