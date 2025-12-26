const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');

class GetUserByRegistrationIdDTO {
  constructor(data) {
    const schema = Joi.object({
      registrationId: Joi.string().max(20).required(),
      type: Joi.string()
        .valid(...userTypes.USER_TYPES)
        .required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetUserByRegistrationIdDTO };
