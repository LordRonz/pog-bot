import type { Message, MessageEmbedOptions } from 'discord.js';
import { decode } from 'html-entities';

import type { Command, CustomClient } from '../client';
import type { AnilistMedia } from '../lib/aniList';
import { getPage } from '../lib/aniList';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';
import removeHtmlTags from '../utils/removeHtmlTags';

const getEmbedDescription = (media?: AnilistMedia) => {
  const description = `
Type: ${media?.type}, Format: ${media?.format}
[MyAnimeList](https://myanimelist.net/${media?.type?.toLowerCase()}/${media?.idMal})
${removeHtmlTags(decode(media?.description))}
`;
  return description;
};

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const anime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const searchTerm = args.join(' ');
    const anilist = await getPage({ ...(searchTerm ? { search: searchTerm } : {}) });
    const media = anilist.data?.Page?.media?.[0];
    const embeds: MessageEmbedOptions = {
      ...baseEmbeds,
      title: media?.title?.romaji,
      url: media?.siteUrl,
      image: {
        url: media?.coverImage?.extraLarge,
      },
      thumbnail: {
        url: media?.bannerImage,
      },
      color: Number(media?.coverImage?.color?.replace('#', '0x')) || baseEmbeds.color,
      description: getEmbedDescription(media),
      fields: [
        {
          name: 'English Title',
          value: `${media?.title?.english}`,
        },
        {
          name: 'Genres',
          value: `${media?.genres?.join(', ')}`,
        },
        ...(media?.startDate?.year
          ? [
              {
                name: 'Start Date',
                value: `${new Date(
                  media.startDate.year,
                  media?.startDate?.month ?? 1,
                  media?.startDate?.day
                ).toLocaleDateString('en-US', dateOptions)}`,
              },
            ]
          : []),
        ...(media?.endDate?.year
          ? [
              {
                name: 'Start Date',
                value: `${new Date(media.endDate.year, media?.endDate?.month ?? 1, media?.endDate?.day).toLocaleDateString(
                  'en-US',
                  dateOptions
                )}`,
              },
            ]
          : []),
        ...(media?.episodes
          ? [
              {
                name: 'Episodes',
                value: `${media?.episodes}`,
              },
            ]
          : []),
        ...(media?.duration
          ? [
              {
                name: 'Duration',
                value: `${media?.duration}`,
              },
            ]
          : []),
        ...(media?.chapters
          ? [
              {
                name: 'Chapters',
                value: `${media?.chapters}`,
              },
            ]
          : []),
        ...(media?.volumes
          ? [
              {
                name: 'Volumes',
                value: `${media?.volumes}`,
              },
            ]
          : []),
        {
          name: 'Source',
          value: `${media?.source}`,
        },
        {
          name: 'Average Score',
          value: `${media?.averageScore}`,
        },
        {
          name: 'Mean Score',
          value: `${media?.meanScore}`,
        },
        {
          name: 'Popularity',
          value: `${media?.popularity}`,
        },
        {
          name: 'Favourites',
          value: `${media?.favourites}`,
        },
      ],
    };
    message.channel.send({ embeds: [fillTimestamp(embeds)] });
  },
};

export default anime;
