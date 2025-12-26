const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class UpdateSemesterByIdDTO {
  constructor(data) {
    const schema = Joi.object({
         id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                  'string.pattern.base': 'id must be a valid id',
                }),
     code:Joi.string().max(20),
     name:Joi.string().max(100),
     department:Joi.string()
             .pattern(/^[0-9a-fA-F]{24}$/)
             .messages({
               'string.pattern.base': 'id must be a valid id',
             }),
     course:Joi.string()
             .pattern(/^[0-9a-fA-F]{24}$/)
             .messages({
               'string.pattern.base': 'id must be a valid id',
             }),
    batch:Joi.string()
             .pattern(/^[0-9a-fA-F]{24}$/)
             .messages({
               'string.pattern.base': 'id must be a valid id',
             }),
    isActive:Joi.boolean(),
    deleted:Joi.boolean(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateSemesterByIdDTO };
