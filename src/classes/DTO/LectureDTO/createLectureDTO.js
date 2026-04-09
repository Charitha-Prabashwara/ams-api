const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class CreateLectureDTO {
  constructor(data) {

    const schema = Joi.object({
        topic: Joi.string().required(),
        lecturer: Joi.objectId().required(),
        subject: Joi.objectId().required(),
        semester: Joi.objectId().required(),
        scheduledTime: Joi.date().required(),
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { CreateLectureDTO };
