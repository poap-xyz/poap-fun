// @ts-nocheck
import { useQuery } from 'react-query';
import cleanDeep from 'clean-deep';

// Lib
import { api, endpoints } from 'lib/api';
import { FetchResponseRaffle } from 'lib/types';

type FetchRafflesValues = {
  page: number;
  query?: string;
};

export const useRaffles = ({ page, query }: FetchRafflesValues) => {
  const fetchRaffles = (key: string, page: number, query: string): Promise<FetchResponseRaffle> =>
    api()
      .url(endpoints.fun.raffles.all)
      .query(cleanDeep({ page, name__icontains: query }))
      .get()
      .json();

  // react query
  return useQuery(['raffles', page, query], fetchRaffles);
};
