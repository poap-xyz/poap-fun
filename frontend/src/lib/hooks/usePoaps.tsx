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
    if (account !== '') {
      const { REACT_APP_API_POAP_API_KEY } = process.env;
      return api().url(endpoints.poap.scan(account)).headers({ 'X-API-Key': REACT_APP_API_POAP_API_KEY! }).get().json();
    }
    return [];
  };

  return useQuery(['poaps', account], fetchPoaps);
};
