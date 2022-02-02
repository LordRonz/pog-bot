import type { Message } from 'discord.js';

import { getPage } from '@/lib/aniList';

import type { Command, CustomClient } from '../client';

const anime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const searchTerm = args.join(' ');
    if (searchTerm) {
      getPage({ search: searchTerm });
    }
    message.channel.send(searchTerm);
  },
};

export default anime;
