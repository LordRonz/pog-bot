import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    winston.format.timestamp({
      format: 'DD-MM-YY HH:MM:SS',
    }),
    winston.format.colorize({
      all: true,
    }),
    winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] [${level}] - ${message}`)
  ),
});

export default logger;
