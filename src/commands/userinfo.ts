import { Message } from 'discord.js';
import { CustomClient, Command } from '../client';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';

const userinfo: Command = {
  run: async (_client: CustomClient, message: Message, args: string[]): Promise<void> => {
    const member =
      (await message.mentions.members?.first()?.fetch(true)) ||
      (await (await message.guild?.members.fetch(args[0]))?.fetch(true));

    if (!member) {
      await message.channel.send('Usage: {Prefix}userinfo @mention');
      return;
    }

    const user = await member.user.fetch(true);

    const embeds = {
      ...baseEmbeds,
      title: `${member.user.username}'s Info'`,
      ...(member.displayAvatarURL({ dynamic: true }) && {
        image: {
          url: user.displayAvatarURL({ dynamic: true }) || '',
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
          name: 'Username',
          value: `\`${user.username}\``,
        },
      ],
    };

    message.channel.send({ embeds: [fillTimestamp(embeds)] });
  },
};

export default userinfo;
