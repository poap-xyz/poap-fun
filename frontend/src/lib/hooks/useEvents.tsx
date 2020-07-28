import { useQuery } from 'react-query';

// lib
import { api, endpoints } from 'lib/api';

// types
import { PoapEvent } from 'lib/types';

const fetchEvents = (): Promise<PoapEvent[]> => api().url(endpoints.poap.events).get().json();

export const useEvents = () => useQuery('events', fetchEvents);
