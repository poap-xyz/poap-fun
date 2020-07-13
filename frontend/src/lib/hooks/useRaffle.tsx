// @ts-nocheck
import { useQuery } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { Raffle } from 'lib/types';

type FetchRaffleValues = {
  id: number;
};

export const useRaffle = ({ id }: FetchRaffleValues) => {
  const fetchRaffle = (key: string, id: number): Promise<Raffle> =>
    api().url(endpoints.fun.raffles.detail(id)).get().json();

  // react query
  return useQuery(['raffle', id], fetchRaffle);
};
