const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class UpdateBatchByIdDTO {
  constructor(data) {
    const schema = Joi.object({
         id:Joi.string()
                      .pattern(/^[0-9a-fA-F]{24}$/)
                      .required()
                      .messages({
                        'string.pattern.base': 'id must be a valid id',
                      }),
       name: Joi.string().trim(),

      lb: Joi.number()
        .integer()       // only whole numbers
        .min(2000)       // optional sanity check
        .max(2100)
    ,

      ub: Joi.number()
        .integer()       // only whole numbers
        .min(Joi.ref('lb'))  // must be >= lb
        .max(2100)
    ,

    deleted:Joi.boolean()

      
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateBatchByIdDTO };
