const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');

class CreateSubjectDTO {
  constructor(data) {
    const schema = Joi.object({
     name:Joi.string().required(),
     code:Joi.string().required(),
     credits:Joi.number().required()
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateSubjectDTO };
