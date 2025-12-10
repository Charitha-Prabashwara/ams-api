const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');
class CreateDepartmentDTO {
  constructor(data) {
    const schema = Joi.object({
      longName: Joi.string().max(100).required(),
      shortName: Joi.string().max(20).required(),
      keyName: Joi.string().max(10).required(),
      description: Joi.string(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateDepartmentDTO };
