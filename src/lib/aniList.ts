import axios from 'axios';

export const ANILIST_API_URL = 'https://graphql.anilist.co';

const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
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
      }
    }
  }
}
`;

export type AnilistQueryVars = {
  search: string;
  page?: number;
  perPage?: number;
};

export const anilistVariablesExample = {
  search: 'Fate/Zero',
  page: 1,
  perPage: 3,
};

export const getPage = async (variables: AnilistQueryVars) => {
  const res = await axios.post(ANILIST_API_URL, {
    query,
    variables,
  });

  return res.data;
};
