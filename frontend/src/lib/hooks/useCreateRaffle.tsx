// @ts-nocheck
import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { safeGetItem } from 'lib/helpers/localStorage';

// Hooks
import { useStateContext } from 'lib/hooks/useCustomState';

// Types
import { Raffle, CreateRaffleValues } from 'lib/types';

export const useCreateRaffle = () => {
  const { saveRaffle } = useStateContext();

  const createRaffle = (raffle: CreateRaffleValues): Promise<Raffle> =>
    api().url(endpoints.fun.raffles.all).post(raffle).json();

  // react query
  return useMutation(createRaffle, {
    onSuccess: (raffle: Raffle) => {
      saveRaffle(raffle);
      localStorage.setItem(`raffle-${raffle.id}`, JSON.stringify(raffle));
      let ids = safeGetItem('raffles-created');
      if (ids && Array.isArray(ids)) {
        if (ids.indexOf(raffle.id) === -1) ids.push(raffle.id);
      } else {
        ids = [raffle.id];
      }
      localStorage.setItem('raffles-created', JSON.stringify(ids));
    },
  });
};
