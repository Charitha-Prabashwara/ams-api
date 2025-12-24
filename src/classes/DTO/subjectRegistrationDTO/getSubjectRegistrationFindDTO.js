const Joi = require('joi');
const { ValidationFailedError } = require('../../../errors');

class GetFindSubjectRegistrationByIdDTO {
  constructor(data) {
    const schema = Joi.object({
    


         student: Joi.string()
                      .pattern(/^[0-9a-fA-F]{24}$/)
                      .messages({
                        'string.pattern.base': 'id must be a valid id',
                      }),
    
         semester: Joi.string()
                      .pattern(/^[0-9a-fA-F]{24}$/)
                      .messages({
                        'string.pattern.base': 'id must be a valid id',
                      }),
    
         subject: Joi.string()
                      .pattern(/^[0-9a-fA-F]{24}$/)
                      .messages({
                        'string.pattern.base': 'id must be a valid id',
                      }),
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
