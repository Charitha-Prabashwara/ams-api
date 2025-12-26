const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');

class GetUserByIdDTO {
  constructor(data) {
    const schema = Joi.object({
      id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'id must be a valid id',
        }),
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

module.exports = { GetUserByIdDTO };
