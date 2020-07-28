// @ts-nocheck
import { useQuery } from 'react-query';

// Lib
import { api, endpoints, Params } from 'lib/api';
import { BlockData } from 'lib/types';

type BlocksParams = {
  raffle?: number | null;
};

export const isParamsEnabled = (params: Params) => Object.values(params).every(Boolean);

const fetchBlocks = (key: string, params: BlocksParams): Promise<BlockData[]> =>
  api().url(endpoints.fun.blocks.all(params)).get().json();

export const useBlocks = (params: BlocksParams) => {
  // react query
  return useQuery(['blocks', params], fetchBlocks, { enabled: isParamsEnabled(params) });
};
