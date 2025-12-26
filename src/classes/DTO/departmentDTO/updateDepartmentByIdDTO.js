const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
class UpdateDepartmentByIdDTO {
  constructor(data) {
    const schema = Joi.object({
      id: Joi.objectId().required(),
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
