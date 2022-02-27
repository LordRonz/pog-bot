import type { CacheType, MessageEmbedOptions, User } from 'discord.js';
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';

import type { Command, CustomClient } from '../client';
import { author, footer } from '../config/config';

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

const getRpsWinnerEmbed = (name: string, draw = false): MessageEmbedOptions => {
  return !draw
    ? {
        color: 0x690000,
        title: 'Rock Paper Scissor',
        author,
        description: `The winner is ${name}`,
        footer,
      }
    : {
        color: 0x690000,
        title: 'Rock Paper Scissor',
        author,
        description: "It's a DRAW",
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
        i.reply({ ephemeral: true, embeds: [{ ...rpsEmbedStage2, timestamp: new Date() }], components: [rpsComponent] });
      } else if (i.customId === 'rock') {
        participants.push({ user: i.user, shape: 'rock' });
        if (participants.length < 2) i.deferUpdate();
      } else if (i.customId === 'paper') {
        participants.push({ user: i.user, shape: 'paper' });
        if (participants.length < 2) i.deferUpdate();
      } else if (i.customId === 'scissor') {
        participants.push({ user: i.user, shape: 'scissor' });
        if (participants.length < 2) i.deferUpdate();
      }
      if (participants.length >= 2) {
        const [p1, p2] = participants;
        if (p1.shape === p2.shape) {
          i.reply({ embeds: [{ ...getRpsWinnerEmbed('bruh', true), timestamp: new Date() }] });
        } else if (p1.shape === 'rock' && p2.shape === 'paper') {
          i.reply({ embeds: [{ ...getRpsWinnerEmbed(p2.user.username), timestamp: new Date() }] });
        } else if (p1.shape === 'rock' && p2.shape === 'scissor') {
          i.reply({ embeds: [{ ...getRpsWinnerEmbed(p1.user.username), timestamp: new Date() }] });
        } else if (p1.shape === 'paper' && p2.shape === 'scissor') {
          i.reply({ embeds: [{ ...getRpsWinnerEmbed(p2.user.username), timestamp: new Date() }] });
        }
        collector.stop('Rock paper scissor game is done');
      }
      collector.resetTimer();
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
