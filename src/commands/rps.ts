import type { CacheType, MessageEmbedOptions, User } from 'discord.js';
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';

import type { Command, CustomClient } from '../client';
import { author, footer } from '../config/config';
import logger from '../config/logger';

const rpsEmbed: MessageEmbedOptions = {
  color: 0x690000,
  title: 'Rock Paper Scissor',
  author,
  description: 'Pls press the button to participate in this game',
  footer,
};

const rpsEmbedStage2: MessageEmbedOptions = {
  color: 0x690000,
  title: 'Rock Paper Scissor',
  author,
  description: 'Pick your shape',
  footer,
};

const lesgo = new MessageActionRow().addComponents(
  new MessageButton().setCustomId('lesgo').setLabel('Lesgo').setStyle('PRIMARY')
);

const rpsComponent = new MessageActionRow().addComponents(
  new MessageButton().setCustomId('rock').setLabel('Rock').setStyle('PRIMARY'),
  new MessageButton().setCustomId('paper').setLabel('Paper').setStyle('PRIMARY'),
  new MessageButton().setCustomId('scissor').setLabel('Scissor').setStyle('PRIMARY')
);

const getRpsWinnerEmbed = (winner: Participant, loser: Participant, draw = false): MessageEmbedOptions => {
  return !draw && winner && loser
    ? {
        color: 0x690000,
        title: 'Rock Paper Scissor',
        author,
        description: `The winner is **${winner.user.username}**\n**${winner.user.username}**: ${winner.shape}\n**${loser.user.username}**: ${loser.shape}`,
        footer,
      }
    : {
        color: 0x690000,
        title: 'Rock Paper Scissor',
        author,
        description: `It's a DRAW\n**${winner.user.username}**: ${winner.shape}\n**${loser.user.username}**: ${loser.shape}`,
        footer,
      };
};

type Participant = {
  user: User;
  shape: 'rock' | 'paper' | 'scissor';
};

const rps: Command = {
  run: async (client: CustomClient, message: Message): Promise<void> => {
    const collector = message.channel.createMessageComponentCollector({
      componentType: 'BUTTON',
      time: 30000,
    });

    const participants: Participant[] = [];

    collector.on('collect', async (i: ButtonInteraction<CacheType>) => {
      if (i.customId === 'lesgo') {
        if (participants.length < 2) {
          i.reply({
            ephemeral: true,
            embeds: [{ ...rpsEmbedStage2, timestamp: new Date() }],
            components: [rpsComponent],
          });
        }
      } else if (i.customId === 'rock') {
        participants.push({ user: i.user, shape: 'rock' });
        if (participants.length < 2) i.reply(`${i.user.username} has chosen`);
      } else if (i.customId === 'paper') {
        participants.push({ user: i.user, shape: 'paper' });
        if (participants.length < 2) i.reply(`${i.user.username} has chosen`);
      } else if (i.customId === 'scissor') {
        participants.push({ user: i.user, shape: 'scissor' });
        if (participants.length < 2) i.reply(`${i.user.username} has chosen`);
      }
      if (participants.length >= 2) {
        try {
          const [p1, p2] = participants;
          if (p1.shape === p2.shape) {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p1, p2, true), timestamp: new Date() }] });
          } else if (p1.shape === 'rock' && p2.shape === 'paper') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p2, p1), timestamp: new Date() }] });
          } else if (p1.shape === 'rock' && p2.shape === 'scissor') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p1, p2), timestamp: new Date() }] });
          } else if (p1.shape === 'paper' && p2.shape === 'scissor') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p2, p1), timestamp: new Date() }] });
          } else if (p2.shape === 'rock' && p1.shape === 'paper') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p1, p2), timestamp: new Date() }] });
          } else if (p2.shape === 'rock' && p1.shape === 'scissor') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p2, p1), timestamp: new Date() }] });
          } else if (p2.shape === 'paper' && p1.shape === 'scissor') {
            await i.reply({ embeds: [{ ...getRpsWinnerEmbed(p1, p2), timestamp: new Date() }] });
          }
          collector.stop('Rock paper scissor game is done');
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          logger.error(message);
        }
      } else {
        collector.resetTimer();
      }
    });

    let msg = await message.channel.send({ embeds: [{ ...rpsEmbed, timestamp: new Date() }], components: [lesgo] });

    collector.on('end', async () => {
      msg = await msg.fetch();
      msg.components.forEach((row) => {
        row.components.forEach((component) => {
          component.setDisabled();
        });
      });
      msg.edit({ embeds: msg.embeds, components: msg.components });
    });
  },
};

export default rps;
