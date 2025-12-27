// middleware/requestTiming.js
module.exports = (req, res, next) => {
  req._hrStart = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(req._hrStart);
    req._responseTimeMs = Number((diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3));
  });

  next();
};
