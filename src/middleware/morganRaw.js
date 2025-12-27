const morgan = require('morgan');
const UAParser = require('ua-parser-js');
const logger = require('../logger/winston');

// Custom tokens
morgan.token('timestamp', () => new Date().toISOString());

morgan.token('wait-time', (req) => {
  if (!req._hrStart) return 0;
  const diff = process.hrtime(req._hrStart);
  return Number((diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3));
});

morgan.token('response-time-ms', (req) => req._responseTimeMs || 0);
morgan.token('route', (req) => req.originalUrl);
morgan.token('ip', (req) => req.ip);

morgan.token('os', (req) => {
  const parser = new UAParser(req.headers['user-agent']);
  return parser.getOS().name || 'Unknown';
});

module.exports = morgan((tokens, req, res) => {
  return JSON.stringify({
    log_timestamp: tokens.timestamp(),
    method: tokens.method(req, res),
    route: tokens.route(req, res),
    status: Number(tokens.status(req, res)),
    request_ip: tokens.ip(req, res),
    user_agent: tokens['user-agent'](req, res),
    requester_os: tokens.os(req, res),
    wait_time_ms: tokens['wait-time'](req, res),
    response_time_ms: tokens['response-time-ms'](req, res)
  });
}, {
  stream: {
    write: (message) => {
      logger.info('HTTP_REQUEST', JSON.parse(message));
    }
  }
});
