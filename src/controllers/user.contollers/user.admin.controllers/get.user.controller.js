const UserService = require('../../../services/UserService');
const userService = new UserService();
const { httpStatus, Strings } = require('../../../config');
const { UserNotFoundError } = require('../../../errors');

exports.getUserById = async (dto, req, res, next) => {
  try {
    const user = await userService.getUserById(dto.type, dto.id);
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

exports.getUserByRegistrationId = async (dto, req, res, next) => {
  try {
    const user = await userService.getUserByRegistrationId(
      dto.type,
      dto.registrationId,
    );
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

exports.getUserByEmailId = async (dto, req, res, next) => {
  try {
    const user = await userService.getUserByEmail(dto.type, dto.email);
    if (userService.isNullUser(user))
      throw new UserNotFoundError('ERROR_USER_NOT_FOUND', 'si');

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

exports.allUsers = async (dto, req, res, next) => {
  
  try {
    const data = {
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
      last_login: dto.lastLogin,
      enable_state: dto.enableState,
      createdAt_timestamp: dto.createdAt,
      updatedAt_timestamp: dto.updatedAt,
      _type: dto.type,
      
    };
    const options = {
      skip: dto.skip,
      limit: dto.limit,
      select: ['-password'],
      sort: dto.sort,
    };
    const users = await userService.getFindUsers(dto.type, data, options);

    return res.status(httpStatus.OK).json({
      success: true,
      data: {
        users: users,
      },
    });
  } catch (error) {
    next(error);
  }
};
