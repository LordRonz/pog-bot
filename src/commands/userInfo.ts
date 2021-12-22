import { GuildMember, Message } from 'discord.js';

import { Command, CustomClient } from '@/client';
import { baseEmbeds, fillTimestamp } from '@/utils/embeds';

const getCustomStatus = (member: GuildMember) => {
  const customStatus = member.presence?.activities.filter((activity) => activity.type === 'CUSTOM');

  return customStatus?.[0];
};

const userinfo: Command = {
  run: async (_client: CustomClient, message: Message, args: string[]): Promise<void> => {
    if (args.length === 0) {
      await message.channel.send('**Usage**: `<prefix>userinfo <User ID | Mention>`');
      return;
    }

    const member =
      (await message.mentions.members?.first()?.fetch(true)) ||
      (await (await message.guild?.members.fetch(args?.[0]))?.fetch(true));

    if (!member) {
      await message.channel.send('Usage: {Prefix}userinfo @mention');
      return;
    }

    const user = await member.user.fetch(true);

    const customStatus = getCustomStatus(member);

    const embeds = {
      ...baseEmbeds,
      title: `${member.user.username}'s Info'`,
      ...(member.displayAvatarURL({ dynamic: true }) && {
        image: {
          url: user.displayAvatarURL({ dynamic: true, size: 2048 }) || '',
        },
      }),
      ...(member.displayAvatarURL({ dynamic: true }) && {
        thumbnail: {
          url: member.displayAvatarURL({ dynamic: true }) || '',
        },
      }),
      fields: [
        {
          name: 'ID',
          value: `\`${member.id}\``,
        },
        ...(member.nickname
          ? [
              {
                name: 'Avatar Hash',
                value: `\`${user.avatar}\``,
              },
            ]
          : []),
        ...(member.presence?.clientStatus
          ? [
              {
                name: 'Client Status',
                value: `\`Desktop: ${member.presence.clientStatus.desktop || 'offline'}\nMobile: ${
                  member.presence.clientStatus.mobile || 'offline'
                }\nWeb: ${member.presence.clientStatus.web || 'offline'}\``,
              },
            ]
          : []),
        ...(member.presence?.status
          ? [
              {
                name: 'Status',
                value: `\`${member.presence.status}\``,
              },
            ]
          : []),
        ...(customStatus
          ? [
              {
                name: 'Custom Status',
                value: `\`${`${customStatus.emoji} ` || ''}${customStatus.state || ''}\``,
              },
            ]
          : []),
        ...(user.hexAccentColor
          ? [
              {
                name: 'Accent Color (HEX)',
                value: `\`${user.hexAccentColor}\``,
              },
            ]
          : []),
        ...(user.bannerURL({ dynamic: true })
          ? [
              {
                name: 'Accent Color (HEX)',
                value: `\`${user.bannerURL({ dynamic: true })}\``,
              },
            ]
          : []),
        {
          name: 'Created At',
          value: `\`${user.createdAt}\``,
        },
        {
          name: 'Default Avatar URL',
          value: `\`${user.defaultAvatarURL}\``,
        },
        {
          name: 'Display Name',
          value: `\`${member.displayName}\``,
        },
        {
          name: 'Display Color',
          value: `\`${member.displayColor}\``,
        },
        {
          name: 'Display Color (HEX)',
          value: `\`${member.displayHexColor}\``,
        },
        ...(member.joinedAt
          ? [
              {
                name: 'Joined At',
                value: `\`${member.joinedAt}\``,
              },
            ]
          : []),
        ...(member.nickname
          ? [
              {
                name: 'Nickname',
                value: `\`${member.nickname}\``,
              },
            ]
          : []),
        {
          name: 'Tag',
          value: `\`${user.tag}\``,
        },
        {
          name: 'Username',
          value: `\`${user.username}\``,
        },
      ],
    };

    message.channel.send({ embeds: [fillTimestamp(embeds)] });
  },
};

export default userinfo;
