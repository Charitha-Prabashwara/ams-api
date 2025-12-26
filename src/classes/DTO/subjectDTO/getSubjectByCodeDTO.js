const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');

class GetSubjectByCodeDTO {
  constructor(data) {
    const schema = Joi.object({
     code: Joi.string()
             .required()
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetSubjectByCodeDTO };
