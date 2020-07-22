// @ts-nocheck
import { useQuery } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { Participant } from 'lib/types';

type FetchParticipantsValues = {
  raffleId: number;
};

export const useParticipants = ({ raffleId }: FetchParticipantsValues) => {
  const fetchParticipants = (key: string, raffleId: number): Promise<Participant[]> =>
    api().url(endpoints.fun.participants.all).query({ raffle: raffleId }).get().json();

  // react query
  return useQuery(['participants', raffleId], fetchParticipants);
};
