import React, { FC, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';

// Components
import { Container } from 'ui/styled/Container';
import { Button } from 'ui/styled/antd/Button';
import TitlePrimary from 'ui/components/TitlePrimary';
import Loading from 'ui/components/Loading';
import Countdown from 'ui/components/Countdown';
import RaffleContent from 'ui/components/RaffleContent';
import RaffleParticipants from 'ui/components/RaffleParticipants';
import BadgeParty from 'ui/components/BadgeParty';
import StatusTag from 'ui/components/StatusTag';
import RaffleEditModal from 'ui/components/RaffleEditModal';

// Components
import { ROUTES } from 'lib/routes';

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useRaffle } from 'lib/hooks/useRaffle';
import { useModal } from 'lib/hooks/useModal';

// Helpers
import { isRaffleActive } from 'lib/helpers/raffles';
import { mergeRaffleEvent } from 'lib/helpers/api';

// Types
import { CompleteRaffle } from 'lib/types';

const RaffleCreated: FC = () => {
  const [completeRaffle, setRaffle] = useState<CompleteRaffle | null>(null);

  const { id } = useParams();
  const { push } = useHistory();
  // Lib hooks
  const { data: raffle } = useRaffle({ id: parseInt(id, 10) });
  const { data: events } = useEvents();
  const { showModal: handleEdit } = useModal({
    component: RaffleEditModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    id: parseInt(id, 10),
    onSuccess: (data: any) => {
      if (data?.id) push(generatePath(ROUTES.raffleEdit, { id: data.id }));
    },
  });

  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setRaffle(completeRaffles[0]);
  }, [raffle, events]); //eslint-disable-line

  const isActive: boolean = completeRaffle ? isRaffleActive(completeRaffle) : false;
  const title =
    isActive && completeRaffle ? (
      <div className={'active-raffle'}>
        <div className={'title'}>{completeRaffle?.name}</div> <StatusTag active={true} className={'status'} />
      </div>
    ) : (
      ''
    );

  // TODO - fix
  let participants: number[] = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10000));

  return (
    <Container sidePadding thinWidth>
      {completeRaffle && (
        <>
          {isActive && (
            <>
              <TitlePrimary title={title} goBack editAction={handleEdit} />
              <Countdown datetime={completeRaffle.draw_datetime} />
            </>
          )}
          {!isActive && <TitlePrimary title={completeRaffle.name} goBack />}

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
