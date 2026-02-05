const DepartmentService = require('../../services/DepartmentService');
const { DepartmentNotFoundError } = require('../../errors');
const deptService = new DepartmentService();

exports.getDepartmentById = async (dto, req, res, next) => {
  try {
    const department = await deptService.getDepartmentById(dto.id, [], {deleted:false});
    if (deptService.isNullDepartment(department))
      throw new DepartmentNotFoundError();
    return res.status(200).json({ success: true, department: department });
  } catch (error) {
    next(error);
  }
};

exports.findDepartment = async (dto, req, res, next) => {
  try {
    const data = {
      name: {
        long: dto.longName,
        short: dto.shortName,
        key: dto.keyName,
      },
      description: dto.description,
      deleted: dto.deleted,
      createdAt_timestamp: dto.createdAt,
      updatedAt_timestamp: dto.updatedAt,
      deleted:false
    };

    const options = {
      skip: dto.skip,
      limit: dto.limit,
      sort: dto.sort,
    };
    const departments = await deptService.getFindDepartment(data, options);
    departments.forEach((department) => {
      if (deptService.isNullDepartment(department))
        throw new DepartmentNotFoundError();
    });
    return res.status(200).json({ success: true, departments: departments });
  } catch (error) {
    next(error);
  }
};
