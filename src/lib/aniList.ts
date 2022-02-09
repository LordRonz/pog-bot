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
      idMal
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
      type
      format
      status
      genres
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      episodes
      duration
      chapters
      volumes
      source
      description
      averageScore
      meanScore
      popularity
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

export enum MediaType {
  ANIME,
  MANGA,
}

export enum MediaFormat {
  TV,
  TV_SHORT,
  MOVIE,
  SPECIAL,
  OVA,
  ONA,
  MUSIC,
  MANGA,
  NOVEL,
  ONE_SHOT,
}

export enum MediaSeason {
  WINTER,
  SPRING,
  SUMMER,
  FALL,
}

export enum MediaSource {
  ORIGINAL,
  MANGA,
  LIGHT_NOVEL,
  VISUAL_NOVEL,
  VIDEO_GAME,
  OTHER,
  NOVEL,
  DOUJINSHI,
  ANIME,
  WEB_NOVEL,
  LIVE_ACTION,
  GAME,
  COMIC,
  MULTIMEDIA_PROJECT,
  PICTURE_BOOK,
}

export enum MediaStatus {
  FINISHED,
  RELEASING,
  NOT_YET_RELEASED,
  CANCELLED,
  HIATUS,
}

export type AnilistMedia = {
  id?: number;
  idMal?: number;
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
  type?: keyof typeof MediaType;
  format?: keyof typeof MediaFormat;
  status?: keyof typeof MediaStatus;
  genres?: string[];
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  source?: keyof typeof MediaSource;
  description?: string;
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
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
