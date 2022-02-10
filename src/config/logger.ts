import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
    }),
    winston.format.printf(({ level, message }) => `[${level.toUpperCase()}] - ${message}`)
  ),
});

export default logger;
