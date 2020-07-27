import moment from 'moment';
import { generatePath } from 'react-router';

// Constants
import { ROUTES } from 'lib/routes';

// Types
import { Raffle, CompleteRaffle } from 'lib/types';

export const createRaffleLink = (raffle: Raffle | CompleteRaffle, relative: boolean): string => {
  const path = generatePath(ROUTES.raffleDetail, { id: raffle.id });
  return relative ? path : `${process.env.REACT_APP_PAGE_URL}${path}`;
};

export const isRaffleActive = (raffle: CompleteRaffle | Raffle): boolean => {
  return moment(raffle.draw_datetime).isAfter(moment());
};

export const isRaffleOnGoing = (raffle: CompleteRaffle | Raffle): boolean => {
  return !raffle.finalized && moment(raffle.draw_datetime).isBefore(moment());
};

export const isRaffleFinished = (raffle: CompleteRaffle | Raffle): boolean => {
  return raffle.finalized === true;
};
