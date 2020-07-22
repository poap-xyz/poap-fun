// @ts-nocheck
import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';

// Hooks

// Types
import { JoinRaffleValues } from 'lib/types';

export const useJoinRaffle = () => {
  const joinRaffle = (data: JoinRaffleValues): Promise<void> => api().url(endpoints.fun.raffles.join).post(data).json();

  // react query
  return useMutation(joinRaffle);
};
