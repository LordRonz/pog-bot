import express from 'express';
import { Client } from 'discord.js';
import { token, intents, partials } from './config/config';
import logger from './config/logger';

const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000);

const client = new Client({ intents, partials });

client.once('ready', () => {
  logger.info('Hello, World!');
  client?.user?.setActivity('Pog');
});

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;

  if (msg.content.toLowerCase() === 'pog') {
    msg.channel.send(msg.content);
  }
});

client.login(token);

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  client?.destroy();
});
