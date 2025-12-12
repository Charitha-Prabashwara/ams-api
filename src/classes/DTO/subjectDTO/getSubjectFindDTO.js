const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');

class GetSubjectFindDTO {
  constructor(data) {
    const schema = Joi.object({
     name:Joi.string(),
     code:Joi.string(),
     credits:Joi.number(),
     deleted:Joi.boolean(),
     createdAt: Joi.date(),
     updatedAt: Joi.date(),

    skip: Joi.number(),
    limit: Joi.number(),
    sort: Joi.string(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { GetSubjectFindDTO };
