import type { Message } from 'discord.js';

import isValidUrl from '@/utils/isValidUrl';

import type { Command } from '../client';
import type { CustomClient } from '../client';

const whatAnime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const imgAttachment = message.attachments.first()?.url;
    const imgUrl = args[0];
    if (!isValidUrl(imgUrl) && !imgAttachment) {
      await message.channel.send('Give me an image attachment or url!');
    }
  },
};

export default whatAnime;
