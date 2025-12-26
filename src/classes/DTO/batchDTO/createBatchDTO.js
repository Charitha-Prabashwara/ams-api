const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');
class CreateBatchDTO {
  constructor(data) {
    const schema = Joi.object({
       name: Joi.string().trim().required(),

      lb: Joi.number()
        .integer()       // only whole numbers
        .min(2000)       // optional sanity check
        .max(2100)
        .required(),

      ub: Joi.number()
        .integer()       // only whole numbers
        .min(Joi.ref('lb'))  // must be >= lb
        .max(2100)
        .required(),

      
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateBatchDTO };
