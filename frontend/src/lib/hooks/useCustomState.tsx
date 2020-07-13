import { useState } from 'react';
import constate from 'constate';

// Helpers
import { safeGetItem } from 'lib/helpers/localStorage';

// Types
import { Raffle } from 'lib/types';
type RaffleDictionary = {
  [id: number]: Raffle;
};

const useCustomState = () => {
  let raffleIds = safeGetItem('raffles-created');
  let raffles: RaffleDictionary = {};
  if (raffleIds && Array.isArray(raffleIds)) {
    for (let id of raffleIds) {
      let raffle = safeGetItem(`raffle-${id}`) as Raffle;
      if (raffle) {
        raffles[raffle.id] = raffle;
      }
    }
  }

  const [rafflesInfo, setRafflesInfo] = useState<RaffleDictionary>(raffles);

  const saveRaffle = (raffle: Raffle) => {
    setRafflesInfo({ ...rafflesInfo, [raffle.id]: raffle });
  };

  return { rafflesInfo, saveRaffle };
};

const [StateProvider, useStateContext] = constate(useCustomState);

export { StateProvider, useStateContext };
