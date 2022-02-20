import type { CacheType, MessageEmbedOptions } from 'discord.js';
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
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

const getRecommendations = (media?: AnilistMedia) => {
  const recommendations = media?.recommendations?.nodes?.map((node) => {
    return `[${node.mediaRecommendation?.title?.romaji}](${node.mediaRecommendation?.siteUrl}) (${node.rating})`;
  });
  return recommendations?.join('\n');
};

const getEmbed = (media: AnilistMedia): MessageEmbedOptions => {
  const embed: MessageEmbedOptions = {
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
              name: 'End Date',
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
              value: `${media?.duration} minute${media.duration > 1 ? 's' : ''}`,
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
      {
        name: 'Recommendations',
        value: `${getRecommendations(media)}`,
      },
    ],
  };
  return embed;
};

const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const endRow = new MessageActionRow().addComponents(
  new MessageButton().setCustomId('end').setLabel('End Interaction').setStyle('SECONDARY')
);

const makeNavRow = (isDisabled: [boolean, boolean, boolean, boolean] = [false, false, false, false]) => {
  return new MessageActionRow().addComponents(
    ...[
      ['first', '<<'],
      ['prev', '<'],
      ['next', '>'],
      ['last', '>>'],
    ].map(([id, label], i) =>
      new MessageButton().setCustomId(id).setLabel(label).setStyle('PRIMARY').setDisabled(isDisabled[i])
    )
  );
};

const anime: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const searchTerm = args.join(' ');
    const anilist = await getPage({ ...(searchTerm ? { search: searchTerm } : {}) });
    const media = anilist.data?.Page?.media?.[0];
    const collector = message.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 30000,
      filter: (m) => m.user === message.author,
    });

    collector.on('collect', async (i: ButtonInteraction<CacheType>) => {
      if (i.customId === 'end') {
        await i.update({});
        collector.stop('User clicked the end interaction button');
      }
    });

    const embed: MessageEmbedOptions = getEmbed(media as AnilistMedia);

    let msg = await message.channel.send({ embeds: [fillTimestamp(embed)], components: [makeNavRow(), endRow] });

    collector.on('end', async () => {
      msg = await msg.fetch();
      msg.components.forEach((row) => {
        row.components.forEach((component) => {
          component.setDisabled();
        });
      });
      msg.edit({ embeds: msg.embeds, components: msg.components });
    });

    if (collector.checkEnd()) {
      collector.stop();
    }
  },
};

export default anime;
