const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class UpdateSubjectRegistrationByIdDTO {
  constructor(data) {
    const schema = Joi.object({
     id: Joi.objectId().required(),
    


         student: Joi.objectId(),
    
         semester: Joi.objectId(),
    
         subject: Joi.objectId().required(),
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

module.exports = { UpdateSubjectRegistrationByIdDTO };
