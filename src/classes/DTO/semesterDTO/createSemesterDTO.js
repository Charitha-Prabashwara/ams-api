const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
class CreateSemesterDTO {
  constructor(data) {
    const schema = Joi.object({
     code:Joi.string().max(20).required(),
     name:Joi.string().max(100).required(),
     department:Joi.objectId().required(),
     course:Joi.objectId().required(),
    batch:Joi.objectId().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateSemesterDTO };
