const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class DeleteSubjectRegistrationByIdDTO {
  constructor(data) {
    const schema = Joi.object({
     id: Joi.objectId().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { DeleteSubjectRegistrationByIdDTO };
