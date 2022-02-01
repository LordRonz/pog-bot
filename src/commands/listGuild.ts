import type { Message } from 'discord.js';

import type { Command, CustomClient } from '../client';
import { admins } from '../config/config';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';

const listguild: Command = {
  run: async (client: CustomClient, message: Message): Promise<void> => {
    if (!admins.has(message.author.id)) {
      message.channel.send('Identify yourself! Who tf are you??');
      return;
    }

    const guilds = await client.guilds.fetch();
    const description = guilds.map((guild) => `${guild.name} ${guild.id}`).join('\n');

    const embed = fillTimestamp({
      ...baseEmbeds,
      description,
      title: 'Joined Guilds',
    });

    message.channel.send({ embeds: [embed] });
  },
};

export default listguild;
