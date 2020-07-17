// @ts-nocheck
import { useQuery } from 'react-query';

// lib
import { api, endpoints } from 'lib/api';

// types
import { UserPoap } from 'lib/types';
type FetchPoapValues = {
  account: string;
};

export const usePoaps = ({ account }: FetchPoapValues) => {
  const fetchPoaps = (key: string, account: string): Promise<UserPoap[]> => {
    if (account !== '') return api().url(endpoints.poap.scan(account)).get().json();
    return [];
  };

  return useQuery(['poaps', account], fetchPoaps);
};
