// @ts-nocheck
// FIXME - Delete - missing react-query types
import { useQuery } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { FetchResponseRaffle } from 'lib/types';

type FetchRafflesValues = {
  page: number;
  query?: string;
};

export const useRaffles = ({ page, query }: FetchRafflesValues) => {
  const fetchRaffles = (key: string, page: number, query: string): Promise<FetchResponseRaffle> =>
    api().url(endpoints.fun.raffles.all).query({ page, name: query }).get().json();

  // react query
  return useQuery(['raffles', page, query], fetchRaffles);
};
