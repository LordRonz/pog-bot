import type { Message, MessageEmbedOptions } from 'discord.js';

import type { Command, CustomClient } from '../client';
import type { CatApiObject, CatFactObject } from '../lib/catto';
import { getCatApi, getCatFact, getCatmojis } from '../lib/catto';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';

const getEmbed = (cats: CatApiObject[], thumbnails: CatApiObject[], facts: CatFactObject[]): MessageEmbedOptions =>
  fillTimestamp({
    ...baseEmbeds,
    title: 'Cat picture :cat:',
    image: {
      url: cats[0].url,
    },
    thumbnail: {
      url: thumbnails[0].url,
    },
    color: 0x631313,
    description: `${getCatmojis()}\nRandom cat facts:\n${facts[0].text}`,
  });

const catto: Command = {
  run: async (client: CustomClient, message: Message): Promise<void> => {
    const [cats, thumbnails, facts] = await Promise.all([getCatApi(), getCatApi(), getCatFact()]);
    message.channel.send({ embeds: [getEmbed(cats, thumbnails, facts)] });
  },
  aliases: ['cat', 'kochenk'],
};

export default catto;
