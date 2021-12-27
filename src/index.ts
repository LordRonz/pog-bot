import express from 'express';

import { CustomClient } from '@/client';
import * as commands from '@/commands';
import { activities, expressPort, intents, partials, token } from '@/config/config';
import logger from '@/config/logger';
import * as events from '@/events';

const app = express();

app.disable('etag');
app.disable('x-powered-by');

app.get('/', (_req, res) => res.send('Hello World!'));
const expressServer = app.listen(expressPort);

const client: CustomClient = new CustomClient({ intents, partials });

Object.entries(events).forEach((event) => {
  client.on(event[0], event[1].bind(null, client));
});

Object.entries(commands).forEach((command) => {
  client.commands.set(command[0], command[1]);

  command[1].aliases?.forEach((alias) => {
    client.commands.set(alias, command[1]);
  });
});

client.once('ready', () => {
  logger.info('Hello, World!');
  client?.user?.setActivity('Hello, World!');
  setInterval(() => {
    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    client?.user?.setActivity(newActivity);
  }, 1000 * 60 * 15);
});

const exitHandler = () => {
  if (expressServer) {
    expressServer.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

client
  .login(token)
  .then(() => {
    logger.info('Logged in!');
  })
  .catch((err) => {
    logger.error(`Failed to login!\n${err}\nTerminating...`);
    client?.destroy();
    exitHandler();
  });

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
};

const gracefulExit = (signal = 'SIGTERM') => {
  logger.info(`${signal} received`);
  client?.destroy();
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// Enable graceful stop

process.once('SIGINT', () => {
  gracefulExit('SIGINT');
});

process.once('SIGTERM', () => {
  gracefulExit('SIGTERM');
});
