const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { ValidationFailedError } = require('../../../errors');

class GetFindSubjectRegistrationByIdDTO {
  constructor(data) {
    const schema = Joi.object({
    


         student: Joi.objectId(),
    
         semester: Joi.objectId(),
    
         subject: Joi.objectId(),
            isActive:Joi.boolean(),
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

module.exports = { GetFindSubjectRegistrationByIdDTO };
