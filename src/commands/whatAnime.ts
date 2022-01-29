import axios from 'axios';
import type { Message, MessageEmbedOptions } from 'discord.js';

import type { Command } from '../client';
import type { CustomClient } from '../client';
import { baseEmbeds } from '../utils/embeds';
import { fillTimestamp } from '../utils/embeds';
import isValidUrl from '../utils/isValidUrl';

const API_URL = 'https://api.trace.moe/';

type TraceMoeResponse = {
  frameCount: number;
  error: string;
  result: {
    anilist: number;
    filename: string;
    episode: number | string | number[] | null;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
  }[];
};

const whatAnime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const imgAttachment = message.attachments.first()?.url;
    const imgUrlMessage = args[0];
    if (!isValidUrl(imgUrlMessage) && !imgAttachment) {
      await message.channel.send('Give me an image attachment or url!');
      return;
    }
    const imgUrl = imgAttachment || imgUrlMessage;
    const res = await axios.get(`${API_URL}search?url=${encodeURIComponent(imgUrl)}`);
    const traceMoeResult = res.data as TraceMoeResponse;
    const embeds: MessageEmbedOptions = {
      ...baseEmbeds,
      title: traceMoeResult.result[0].filename,
      image: {
        url: traceMoeResult.result[0].image,
      },
      url: `https://anilist.co/anime/${traceMoeResult.result[0].anilist}`,
      fields: [
        {
          name: 'Similarity',
          value: `${traceMoeResult.result[0].similarity}`,
        },
        {
          name: 'Video',
          value: traceMoeResult.result[0].video,
        },
        {
          name: 'Image',
          value: traceMoeResult.result[0].image,
        },
      ],
    };

    message.channel.send({ embeds: [fillTimestamp(embeds)] });
  },
};

export default whatAnime;
