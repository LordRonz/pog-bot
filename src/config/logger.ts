import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.timestamp({
      format: 'DD-MM-YY SS:MM:HH',
    }),
    winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] [${level.toUpperCase()}] - ${message}`)
  ),
});

export default logger;
