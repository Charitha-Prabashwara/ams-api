const UserService = require('../../../services/UserService');
const userService = new UserService();
const { httpStatus } = require('../../../config');
const { UserUpdateFailed, UserNotFoundError } = require('../../../errors');

exports.userDeleteById = async (dto, req, res, next) => {
  try {
    const user = await userService.deleteUserById(dto.type, dto.id);
    if (userService.isNullUser(user)) throw new UserNotFoundError();
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
