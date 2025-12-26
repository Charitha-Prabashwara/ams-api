const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class CreateLectureSubjectRegistrationDTO {
  constructor(data) {
    const schema = Joi.object({
        lecturer: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                  'string.pattern.base': 'id must be a valid id',
                }),
        subject: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                  'string.pattern.base': 'id must be a valid id',
                }),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateLectureSubjectRegistrationDTO };
