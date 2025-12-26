const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
class UpdateBatchByIdDTO {
  constructor(data) {
    const schema = Joi.object({
         id: Joi.objectId().required(),
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
