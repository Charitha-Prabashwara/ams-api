const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class CreateSubjectRegistrationDTO {
  constructor(data) {
    const schema = Joi.object({
     student: Joi.objectId().required(),

     semester: Joi.objectId().required(),

     subject: Joi.objectId().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateSubjectRegistrationDTO };
