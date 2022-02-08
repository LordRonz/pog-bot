import axios from 'axios';

export const ANILIST_API_URL = 'https://graphql.anilist.co';

const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String, $rPage: Int, $rPerPage: Int) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      genres
      episodes
      duration
      averageScore
      favourites
      recommendations (page: $rPage, perPage: $rPerPage) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        nodes {
          id
          media {
            id
            title {
              romaji
              english
              native
            }
          }
        }
      }
      siteUrl
    }
  }
}
`;

export type AnilistQueryVars = {
  search?: string;
  page?: number;
  perPage?: number;
  rPage?: number;
  rPerPage?: number;
};

export type AnilistError = {
  message: string;
  status: number;
  locations: {
    line: number;
    column: number;
  }[];
};

export type AnilistMedia = {
  id?: number;
  title?: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  coverImage?: {
    extraLarge?: string;
    large?: string;
    medium?: string;
    color?: string;
  };
  bannerImage?: string;
  genres?: string[];
  episodes?: number;
  duration?: number;
  averageScore?: number;
  meanScore?: number;
  favourites?: number;
  recommmendations?: {
    pageInfo?: AnilistPageInfo;
    nodes?: {
      id?: number;
      title?: {
        romaji?: string;
        english?: string;
        native?: string;
      };
    }[];
  };
  siteUrl?: string;
};

export type AnilistPageInfo = {
  total?: number;
  currentPage?: number;
  lastPage?: number;
  hasNextPage?: boolean;
  perPage?: number;
};

export type AnilistQueryResponse = {
  data?: {
    Page?: {
      pageInfo?: AnilistPageInfo;
      media?: AnilistMedia[];
    };
  };
  errors?: AnilistError[];
};

export const anilistVariablesExample = {
  search: 'Fate/Zero',
  page: 1,
  perPage: 3,
};

export const getPage = async (variables: AnilistQueryVars = {}) => {
  variables.page = variables.page ?? 1;
  variables.perPage = variables.perPage ?? 5;
  variables.rPage = variables.rPage ?? 1;
  variables.rPerPage = variables.rPerPage ?? 5;
  const res = await axios.post<AnilistQueryResponse>(ANILIST_API_URL, {
    query,
    variables,
  });

  return res.data;
};
