const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');
class UpdateLectureSubjectRegistrationDTO {
  constructor(data) {
    const schema = Joi.object({
      id: Joi.objectId().required(),
        lecturer: Joi.objectId(),
        subject:Joi.objectId(),
        isActive: Joi.boolean(),
        deleted: Joi.boolean(),
      
          
            
    });

    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }

    Object.assign(this, value);
  }
}

module.exports = { UpdateLectureSubjectRegistrationDTO };
