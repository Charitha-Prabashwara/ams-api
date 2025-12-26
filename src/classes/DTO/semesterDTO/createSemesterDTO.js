const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class CreateSemesterDTO {
  constructor(data) {
    const schema = Joi.object({
     code:Joi.string().max(20).required(),
     name:Joi.string().max(100).required(),
     department:Joi.string()
             .pattern(/^[0-9a-fA-F]{24}$/)
             .required()
             .messages({
               'string.pattern.base': 'id must be a valid id',
             }),
     course:Joi.string()
             .pattern(/^[0-9a-fA-F]{24}$/)
             .required()
             .messages({
               'string.pattern.base': 'id must be a valid id',
             }),
    batch:Joi.string()
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

module.exports = { CreateSemesterDTO };
