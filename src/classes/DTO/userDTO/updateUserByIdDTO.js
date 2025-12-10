const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');
class UpdateUserByIdDTO {
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

      registrationId: Joi.string().max(20).required(),
      firstName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .required()
        .messages({
          'string.pattern.base': 'First name must be uppercase letters only',
        }),

      lastName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Last name must be uppercase letters only',
        }),

      fullName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Full name must be uppercase letters only',
        }),

      nameWithInitial: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .required()
        .messages({
          'string.pattern.base': 'Full name must be uppercase letters only',
        }),

      email: Joi.string().email().required(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string(),
      addressZip: Joi.number().integer().required(),

      type: Joi.string()
        .valid(...userTypes.USER_TYPES)
        .required(),

      departmentId: Joi.string(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateUserByIdDTO };
