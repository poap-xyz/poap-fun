import slugify from 'slugify';
import { generatePath } from 'react-router';

// Constants
import { ROUTES } from 'lib/routes';

// Types
import { Raffle } from 'lib/types';

export const createRaffleLink = (raffle: Raffle, relative: boolean): string => {
  const path = generatePath(ROUTES.raffleDetail, { id: raffle.id, slug: slugify(raffle.name.toLowerCase()) });
  if (relative) return path;
  return `${process.env.REACT_APP_PAGE_URL}${path}`;
};
