const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class GetFindDepartmentDTO {
  constructor(data) {
    const schema = Joi.object({
      longName: Joi.string().max(100),
      shortName: Joi.string().max(20),
      keyName: Joi.string().max(10),
      description: Joi.string(),
      deleted: Joi.boolean().default(false),
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

module.exports = { GetFindDepartmentDTO };
