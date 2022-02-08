import type { Message, MessageEmbedOptions } from 'discord.js';

import type { Command, CustomClient } from '../client';
import { getPage } from '../lib/aniList';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';

const anime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const searchTerm = args.join(' ');
    const anilist = await getPage({ ...(searchTerm ? { search: searchTerm } : {}) });
    const embeds: MessageEmbedOptions = {
      ...baseEmbeds,
      title: anilist.data?.Page?.media?.[0].title?.romaji,
      url: anilist.data?.Page?.media?.[0].siteUrl,
      image: {
        url: anilist.data?.Page?.media?.[0].coverImage?.extraLarge,
      },
      thumbnail: {
        url: anilist.data?.Page?.media?.[0].bannerImage,
      },
      color: Number(anilist.data?.Page?.media?.[0].coverImage?.color?.replace('#', '0x')),
    };
    message.channel.send({ embeds: [fillTimestamp(embeds)] });
  },
};

export default anime;
