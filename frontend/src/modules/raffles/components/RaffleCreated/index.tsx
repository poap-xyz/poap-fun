import React, { FC } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// Components
import { Container } from 'ui/styled/Container';
import TitlePrimary from 'ui/components/TitlePrimary';
import RaffleCreatedCard from 'ui/components/RaffleCreatedCard';

// Hooks
import { useStateContext } from 'lib/hooks/useCustomState';

// Constants
import { ROUTES } from 'lib/routes';

const RaffleCreated: FC = () => {
  const { id } = useParams();
  const { push } = useHistory();
  const { rafflesInfo } = useStateContext();

  if (!rafflesInfo[id]) push(ROUTES.home);

  const raffle = rafflesInfo[id];

  return (
    <Container sidePadding thinWidth>
      {raffle && (
        <>
          <TitlePrimary title={raffle.name} />
          <RaffleCreatedCard raffle={raffle} />
        </>
      )}
    </Container>
  );
};

export default RaffleCreated;
