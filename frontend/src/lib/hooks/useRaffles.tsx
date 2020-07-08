import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { FetchResponseRaffle } from 'lib/types';

type FetchRafflesValues = {
  page: number;
  query?: string;
};

export const useRaffles = () => {
  const fetchRaffles = ({ page, query }: FetchRafflesValues): Promise<FetchResponseRaffle> =>
    api().url(endpoints.fun.raffles.all).query({ page, query }).get().json();

  // react query
  return useMutation(fetchRaffles);
};
