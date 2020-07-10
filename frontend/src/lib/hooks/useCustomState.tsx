import { useState } from 'react';
import constate from 'constate';

// Types
import { Raffle } from 'lib/types';
type RaffleDictionary = {
  [id: number]: Raffle;
};

const useCustomState = () => {
  const [rafflesInfo, setRafflesInfo] = useState<RaffleDictionary>({});

  const saveRaffle = (raffle: Raffle) => {
    setRafflesInfo({ ...rafflesInfo, [raffle.id]: raffle });
  };

  return { rafflesInfo, saveRaffle };
};

const [StateProvider, useStateContext] = constate(useCustomState);

export { StateProvider, useStateContext };
