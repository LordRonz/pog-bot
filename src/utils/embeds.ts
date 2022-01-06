import type { MessageEmbedOptions } from 'discord.js';

import { author, footer } from '../config/config';

export type BaseEmbeds = {
  color: number;
  author: {
    name: string;
    url: string;
  };
  footer: {
    text: string;
  };
};

export const baseEmbeds: BaseEmbeds = {
  color: 0x690000,
  author,
  footer,
};

export type EmbedWithTimestamp = MessageEmbedOptions & {
  timestamp?: Date;
};

export const fillTimestamp = (embed: MessageEmbedOptions): EmbedWithTimestamp => {
  return { ...embed, timestamp: new Date() };
};
