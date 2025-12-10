function ErrorHandler(err, req, res, next) {
  const date = new Date().toISOString();
  console.error(err.message + ':' + date);
  return res.status(err.statusCode || 500).json({
    success: err.success,
    message: err.message,
    details: err.details,
    timestamp: date,
  });
}

module.exports = ErrorHandler;
