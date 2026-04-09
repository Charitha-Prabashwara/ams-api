const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class UpdateLectureByIdDTO {
  constructor(data) {

    const schema = Joi.object({
        id:Joi.objectId().required(),
        topic: Joi.string(),
        lecturer: Joi.objectId(),
        subject: Joi.objectId(),
        semester: Joi.objectId(),
        scheduledTime: Joi.date(),
        endTime:Joi.date(),
        state:Joi.string(),
        deleted:Joi.boolean()
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateLectureByIdDTO };
