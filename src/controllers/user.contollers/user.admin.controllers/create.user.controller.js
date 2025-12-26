const UserService = require('../../../services/UserService');
const userService = new UserService();

exports.create = async (dto, req, res, next) => {
  try {
    const user = await userService.createNewUser(dto.type, {
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
      password: dto.password,
      department: dto.departmentId,
    });

    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    next(error);
  }
};
