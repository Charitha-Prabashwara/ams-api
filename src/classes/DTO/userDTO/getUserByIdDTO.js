const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
const { userTypes } = require('../../../config');

class GetUserByIdDTO {
  constructor(data) {
    const schema = Joi.object({
      id: Joi.objectId().required(),
      type: Joi.string()
        .valid(...userTypes.USER_TYPES)
        .required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetUserByIdDTO };
