// @ts-nocheck
import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';

// Types
type PrizeDeleteProp = {
  id: number;
  token: string | undefined;
};

export const useDeletePrize = () => {
  const deletePrize = ({ id, token }: PrizeDeleteProp): Promise<void> =>
    api().auth(token).url(endpoints.fun.prizes.detail(id)).delete();

  // react query
  return useMutation(deletePrize);
};
