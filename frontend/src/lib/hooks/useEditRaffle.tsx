// @ts-nocheck
import { useMutation } from 'react-query';
import cleanDeep from 'clean-deep';

// Lib
import { api, endpoints } from 'lib/api';
import { safeGetItem } from 'lib/helpers/localStorage';

// Hooks
import { useStateContext } from 'lib/hooks/useCustomState';

// Types
import { Raffle, CreatePrize } from 'lib/types';
type UpdateRaffleValues = {
  id: number;
  token: string;
  name?: string;
  description?: string;
  contact?: string;
  draw_datetime?: string;
  one_address_one_vote?: boolean;
  prizes?: CreatePrize[];
};

const patchRaffle = ({
  id,
  token,
  name,
  description,
  one_address_one_vote,
  contact,
  draw_datetime,
  prizes,
}: UpdateRaffleValues): Promise<Raffle> => {
  return api()
    .auth(token)
    .url(endpoints.fun.raffles.detail(id))
    .json(
      cleanDeep({
        name,
        description,
        one_address_one_vote,
        contact,
        draw_datetime,
        prizes,
      }),
    )
    .patch()
    .json()
    .then((data) => {
      if (data) {
        return { ...data, token };
      }
    });
};

export const useEditRaffle = () => {
  const { saveRaffle } = useStateContext();
  // react query
  return useMutation(patchRaffle, {
    onSuccess: (raffle: Raffle | null) => {
      if (raffle) {
        saveRaffle(raffle);
        localStorage.setItem(`raffle-${raffle.id}`, JSON.stringify(raffle));
        let ids = safeGetItem('raffles-created');
        if (ids && Array.isArray(ids)) {
          if (ids.indexOf(raffle.id) === -1) ids.push(raffle.id);
        } else {
          ids = [raffle.id];
        }
        localStorage.setItem('raffles-created', JSON.stringify(ids));
      }
    },
  });
};
