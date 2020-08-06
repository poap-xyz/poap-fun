// @ts-nocheck
import { useMutation } from 'react-query';

// Lib
import { api, endpoints } from 'lib/api';

// Types
import { SubscriptionValues } from 'lib/types';

export const useSubscribe = () => {
  const subscribe = (data: SubscriptionValues): Promise<void> =>
    api().url(endpoints.fun.raffles.subscribe).post(data).json();

  // react query
  return useMutation(subscribe);
};

export const useUnsubscribe = () => {
  const unsubscribe = (data: SubscriptionValues): Promise<void> =>
    api().url(endpoints.fun.raffles.unsubscribe).post(data).json();

  // react query
  return useMutation(unsubscribe);
};
