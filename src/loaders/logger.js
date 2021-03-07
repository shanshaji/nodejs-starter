const winston = require('winston');

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: '../logs/app.log' })],
});

// enable console logs in non production env
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

module.exports = logger;
