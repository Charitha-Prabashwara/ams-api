const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class GetSemesterByCodeDTO {
  constructor(data) {
    const schema = Joi.object({
     code:Joi.string().max(20).required(),
    
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetSemesterByCodeDTO };
