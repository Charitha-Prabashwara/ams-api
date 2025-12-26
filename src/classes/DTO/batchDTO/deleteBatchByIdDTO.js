const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class DeleteBatchByIdDTO {
  constructor(data) {
    const schema = Joi.object({
      id:Joi.string()
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

module.exports = { DeleteBatchByIdDTO };
