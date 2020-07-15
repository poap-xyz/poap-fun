import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Components
import { Container } from 'ui/styled/Container';
import { Button } from 'ui/styled/antd/Button';
import TitlePrimary from 'ui/components/TitlePrimary';
import Loading from 'ui/components/Loading';
import Countdown from 'ui/components/Countdown';
import RaffleContent from 'ui/components/RaffleContent';
import RaffleParticipants from 'ui/components/RaffleParticipants';
import BadgeParty from 'ui/components/BadgeParty';

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useRaffle } from 'lib/hooks/useRaffle';

// Helpers
import { isRaffleActive } from 'lib/helpers/raffles';
import { mergeRaffleEvent } from 'lib/helpers/api';

// Types
import { CompleteRaffle } from 'lib/types';

const RaffleCreated: FC = () => {
  const [completeRaffle, setRaffle] = useState<CompleteRaffle | null>(null);

  const { id } = useParams();
  // Lib hooks
  const { data: raffle } = useRaffle({ id: parseInt(id, 10) });
  const { data: events } = useEvents();

  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setRaffle(completeRaffles[0]);
  }, [raffle, events]); //eslint-disable-line

  const isActive: boolean = completeRaffle ? isRaffleActive(completeRaffle) : false;

  // TODO - fix
  let participants: number[] = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10000));

  return (
    <Container sidePadding thinWidth>
      {completeRaffle && (
        <>
          <TitlePrimary title={completeRaffle.name} goBack />
          {isActive && <Countdown datetime={completeRaffle.draw_datetime} />}
          <RaffleContent raffle={completeRaffle} />
          {isActive && <Button type={'primary'}>Join Raffle</Button>}
          <RaffleParticipants participants={participants} />
          <BadgeParty />
        </>
      )}
      {!completeRaffle && <Loading />}
    </Container>
  );
};

export default RaffleCreated;
