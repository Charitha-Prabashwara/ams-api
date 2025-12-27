const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const transport = new DailyRotateFile({
  filename: 'logs/request/api-requests-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d'
});

const logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [
    transport,
    //new winston.transports.Console() // remove in production if needed
  ]
});

module.exports = logger;
