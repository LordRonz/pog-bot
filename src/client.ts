import { Client, Collection, Message } from 'discord.js';

import * as config from './config/config';

export type CustomClientType = Client & {
  commands: Collection<string, Command>;
  config: config.Config;
};

export class CustomClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  public config: config.Config = config;
}

export type Command = {
  run: (client: CustomClientType, msg: Message, args: string[]) => Promise<void>;
  aliases?: string[];
};
