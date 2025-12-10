const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');
class UpdateDepartmentByIdDTO {
  constructor(data) {
    const schema = Joi.object({
      id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          'string.pattern.base': 'id must be a valid id',
        }),
      longName: Joi.string().max(100),
      shortName: Joi.string().max(20),
      keyName: Joi.string().max(10),
      description: Joi.string(),
      deleted: Joi.boolean(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateDepartmentByIdDTO };
