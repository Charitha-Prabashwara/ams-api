const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');

class getUserByEmailDTO {
  constructor(data) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
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

module.exports = { getUserByEmailDTO };
