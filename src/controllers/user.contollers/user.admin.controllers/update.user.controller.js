const UserService = require('../../../services/UserService');
const userService = new UserService();
const { httpStatus } = require('../../../config');
const { UserUpdateFailed } = require('../../../errors');

exports.updateById = async (dto, req, res, next) => {
  try {
    const updateObj = {
      id: dto.id,
      registration_id: dto.registrationId,
      name: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        full_name: dto.fullName,
        with_initial_name: dto.nameWithInitial,
      },
      email: dto.email,
      address: {
        line1: dto.addressLine1,
        line2: dto.addressLine2,
        zip: dto.addressZip,
      },
      department: dto.departmentId,
      enable_state:dto.status
    };
    const user = await userService.findByIdAndUpdate(dto.type, updateObj);
    if (userService.isNullUser(user)) throw new UserUpdateFailed();

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        user: user,
      },
    });
  } catch (error) {
    next(error);
  }
};
