import type { Message, MessageEmbedOptions } from 'discord.js';

import type { Command } from '../client';
import type { CustomClient } from '../client';
import { author, footer, prefix } from '../config/config';

const helpEmbed: MessageEmbedOptions = {
  color: 0x690000,
  title: 'Help',
  author,
  description: `Prefix = \`${prefix}\``,
  fields: [
    {
      name: `${prefix}help`,
      value: 'Shows this message',
    },
    {
      name: `${prefix}userinfo`,
      value: "Shows someone's account information",
    },
  ],
  footer,
};

const help: Command = {
  run: async (client: CustomClient, message: Message): Promise<void> => {
    message.channel.send({ embeds: [{ ...helpEmbed, timestamp: new Date() }] });
  },
};

export default help;
