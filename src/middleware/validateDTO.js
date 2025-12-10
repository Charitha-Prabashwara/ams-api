const { ValidationFailedError } = require('../errors');

function validateDTO(DtoClass) {
  return (req, res, next) => {
    try {
      req.body = new DtoClass(req.body);
      next();
    } catch (error) {
      throw new ValidationFailedError(error.message, 400, error.details);
    }
  };
}

module.exports = { validateDTO };
