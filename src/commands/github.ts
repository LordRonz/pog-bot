import type { Message } from 'discord.js';

import type { Command } from '../client';
import type { CustomClient } from '../client';
import octokit from '../config/octokit';
import { baseEmbeds, fillTimestamp } from '../utils/embeds';

type Info = {
  id?: number | null;
  node_id?: string | null;
  avatar_url?: string | null;
  html_url?: string | null;
  url?: string | null;
  type?: string | null;
  name?: string | null;
  company?: string | null;
  blog?: string | null;
  location?: string | null;
  email?: string | null;
  hireable?: string | null;
  bio?: string | null;
  twitter_username?: string | null;
  public_repos?: number | null;
  public_gists?: number | null;
  followers?: number | null;
  following?: number | null;
  created_at?: string | null;
};

const getUserEmbed = (info: Info) => {
  return {
    ...baseEmbeds,
    title: `${info.name} (GitHub User)`,
    fields: Object.entries(info).map((field) => {
      return {
        name: field[0].replace('_', ' '),
        value: `${field[1]}`,
      };
    }),
  };
};

const flags = ['-u', '-r'];

const github: Command = {
  run: async (client: CustomClient, message: Message, args: string[]): Promise<void> => {
    if (args.length === 0) {
      return;
    }

    if (!flags.some((flag) => flag === args[0])) {
      const { data } = await octokit.rest.users.getByUsername({ username: args[0] });
      const info: Info = {
        id: data.id as number | null,
        node_id: data.node_id as string | null,
        avatar_url: data.avatar_url as string | null,
        html_url: data.html_url as string | null,
        url: data.url as string | null,
        type: data.type as string | null,
        name: data.name as string | null,
        company: data.company as string | null,
        blog: data.blog as string | null,
        location: data.location as string | null,
        email: data.email as string | null,
        hireable: data.hireable as string | null,
        bio: data.bio as string | null,
        twitter_username: data.twitter_username as string | null,
        public_repos: data.public_repos as number | null,
        public_gists: data.public_gists as number | null,
        followers: data.followers as number | null,
        following: data.following as number | null,
        created_at: data.created_at as string | null,
      };
      await message.channel.send({ embeds: [fillTimestamp(getUserEmbed(info))] });
    }
  },
};

export default github;
