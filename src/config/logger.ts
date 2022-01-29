import chalk from 'chalk';
import winston from 'winston';

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.printf((log) => {
    let level = log.level.toUpperCase();
    // TODO Add coloring for another levels https://github.com/winstonjs/winston#logging-levels
    switch (level) {
      case 'INFO':
        level = chalk.green(level);
        break;
      case 'WARN':
        level = chalk.yellow(level);
        break;
      case 'ERROR':
        level = chalk.red(level);
        break;
      default:
        break;
    }
    return `[${level}] - ${log.message}`;
  }),
});

export default logger;
