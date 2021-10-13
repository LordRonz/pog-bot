import { Intents, PartialTypes } from 'discord.js';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(__dirname, '../../.env') });

export const token: string = process.env.TOKEN || 'abcd';
export const guildId: string = process.env.GUILDID || 'abcd';
export const clientId: string = process.env.CLIENTID || 'abcd';
export const intents: number[] = [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
];
export const partials: PartialTypes[] = ['MESSAGE', 'CHANNEL', 'REACTION'];
export const prefix = '-';

export interface Config {
  token: string;
  guildId: string;
  clientId: string;
  intents: number[];
  prefix: string;
}
