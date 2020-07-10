// @ts-nocheck
import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';

// Hooks
// import { useAuthContext } from 'lib/hooks/common/useAuth';
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
    },
  });
};
