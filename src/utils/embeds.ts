/* eslint-disable import/prefer-default-export */
import { MessageEmbedOptions } from 'discord.js';
import { author, footer } from '../config/config';

export const baseEmbeds = {
  color: 0x690000,
  author,
  footer,
};

export interface EmbedWithTimestamp extends MessageEmbedOptions {
  timestamp?: Date;
}

export const fillTimestamp = (embed: MessageEmbedOptions): EmbedWithTimestamp => {
  return { ...embed, timestamp: new Date() };
};
