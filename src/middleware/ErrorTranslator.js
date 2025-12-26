const { DuplicateKeyError, ValidationError } = require('../errors');

function ErrorTranslator(err, req, res, next) {
  if (err.code === 11000) {
    err = new DuplicateKeyError(err);
  } else if (err.name === 'ValidationError') {
    err = new ValidationError(err);
  }

  next(err);
}

module.exports = ErrorTranslator;
