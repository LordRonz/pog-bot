import type { AxiosRequestHeaders } from 'axios';
import axios from 'axios';

export type CatApiObject = {
  id: string;
  url: string;
  categories?: {
    id: number;
    name: string;
  }[];
};

export type CatFactObject = {
  text: string;
  deleted: boolean;
  source: string;
  status: {
    verified: boolean;
    sentCount: number;
  };
};

export const getCatApi = async () => {
  const apiUrl = 'https://api.thecatapi.com/';
  const apiKey = process.env.CATAPI;
  const headers = { 'x-api-key': apiKey } as AxiosRequestHeaders;
  const config = { headers };

  const res = await axios.get<CatApiObject[]>(`${apiUrl}v1/images/search`, config);
  return res.data;
};

export const getCatFact = async (amount = 10) => {
  const apiUrl = 'https://cat-fact.herokuapp.com/';
  let retry = 0;
  while (retry++ < 10) {
    const res = await axios.get<CatFactObject[]>(`${apiUrl}facts/random?amount=${amount}`);
    res.data = res.data.filter((fact) => fact.status.verified);
    if (res.data.length > 0) {
      return res.data;
    }
  }
  return [];
};

export const catmojis = [
  {
    name: 'SCblushy',
    id: '834155037852696656',
    animated: false,
  },
  {
    name: 'patpat',
    id: '850326207874072658',
    animated: true,
  },
  {
    name: 'petpetcat',
    id: '829607417863995421',
    animated: true,
  },
  {
    name: 'SCpetpetcat',
    id: '676070904178016297',
    animated: true,
  },
  {
    name: 'Cat',
    id: '760379977320890398',
    animated: true,
  },
  {
    name: 'SCsmack',
    id: '780373520744054804',
    animated: true,
  },
  {
    name: 'SCfall',
    id: '664508741491752970',
    animated: true,
  },
  {
    name: 'SChuggies',
    id: '868468974571122718',
    animated: true,
  },
  {
    name: 'SCWshakeblush',
    id: '676858244391501824',
    animated: true,
  },
  {
    name: 'SCdance',
    id: '664513443675635732',
    animated: true,
  },
  {
    name: 'SCGblush',
    id: '664513356119539772',
    animated: false,
  },
  {
    name: 'SCWblushHEART',
    id: '753106557906190448',
    animated: false,
  },
  {
    name: 'SCchilling',
    id: '853896881532567572',
    animated: true,
  },
  {
    name: 'SCcatkiss',
    id: '750470459866480650',
    animated: true,
  },
];

export const getCatmoji = () => {
  const catmoji = catmojis[Math.floor(Math.random() * catmojis.length)];
  return `<${catmoji.animated ? 'a' : ''}:${catmoji.name}:${catmoji.id}>`;
};

export const getCatmojis = (count = 5) => {
  return [...Array(count)].map(() => getCatmoji()).join(' ');
};

export const getRedditCat = () => 211;
