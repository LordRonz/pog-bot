import type { Message } from 'discord.js';

import type { Command, CustomClient } from '../client';

const anime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const searchTerm = args.join(' ');
    message.channel.send(searchTerm);
  },
};

export default anime;
