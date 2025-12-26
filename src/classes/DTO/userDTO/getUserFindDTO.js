const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');

class GetUserFindDTO {
  constructor(data) {
    const schema = Joi.object({
      registrationId: Joi.string().max(20),
      firstName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .messages({
          'string.pattern.base': 'First name must be uppercase letters only',
        }),

      lastName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .messages({
          'string.pattern.base': 'Last name must be uppercase letters only',
        }),

      fullName: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .messages({
          'string.pattern.base': 'Full name must be uppercase letters only',
        }),

      nameWithInitial: Joi.string()
        .pattern(/^[A-Z. ]+$/)
        .messages({
          'string.pattern.base': 'Full name must be uppercase letters only',
        }),

      email: Joi.string().email(),
      addressLine1: Joi.string(),
      addressLine2: Joi.string(),
      addressZip: Joi.number().integer(),

      type: Joi.string()
        .valid(...userTypes.USER_TYPES)
        .required(),

      departmentId: Joi.objectId(),
      lastLogin: Joi.date(),
      enableState: Joi.boolean(),
      createdAt: Joi.date(),
      updatedAt: Joi.date(),

      skip: Joi.number(),
      limit: Joi.number(),
      sort: Joi.string(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetUserFindDTO };
