import slugify from 'slugify';
import moment from 'moment';
import { generatePath } from 'react-router';

// Constants
import { ROUTES } from 'lib/routes';

// Types
import { Raffle, CompleteRaffle } from 'lib/types';

export const createRaffleLink = (raffle: Raffle | CompleteRaffle, relative: boolean): string => {
  const path = generatePath(ROUTES.raffleDetail, { id: raffle.id, slug: slugify(raffle.name.toLowerCase()) });
  if (relative) return path;
  return `${process.env.REACT_APP_PAGE_URL}${path}`;
};

export const isRaffleActive = (raffle: CompleteRaffle): boolean => {
  return moment(raffle.draw_datetime).isAfter(moment());
};

export const isRaffleOnGoing = (raffle: CompleteRaffle): boolean => {
  return moment(raffle.draw_datetime).isBefore(moment());
};

export const isRaffleFinished = (raffle: CompleteRaffle): boolean => {
  return raffle.finalized === true;
};
