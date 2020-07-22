// @ts-nocheck
import { useQuery } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';
import { ResultsTable } from 'lib/types';

type FetchResultsValues = {
  id?: number | null;
};

const fetchResults = (key: string, id: number): Promise<ResultsTable> =>
  api().url(endpoints.fun.results.detail(id)).get().json();

export const useResults = ({ id }: FetchResultsValues) => {
  // react query
  return useQuery(['results', id], fetchResults, { enabled: id });
};
