const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class GetFindLectureDTO {
  constructor(data) {

    const schema = Joi.object({
    
        topic: Joi.string(),
        lecturer: Joi.objectId(),
        subject: Joi.objectId(),
        semester: Joi.objectId(),
        scheduledTime: Joi.date(),
        endTime:Joi.date(),
        state:Joi.string(),
        deleted:Joi.boolean(),
        createdAt:Joi.date(),
        updatedAt:Joi.date(),
        
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

module.exports = { GetFindLectureDTO };
