const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class UpdateSubjectByIdDTO {
  constructor(data) {
    const schema = Joi.object({
           id: Joi.objectId().required(),
     name:Joi.string(),
     code:Joi.string(),
     credits:Joi.number(),
     deleted:Joi.boolean(),

    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateSubjectByIdDTO };
