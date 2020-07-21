import React, { FC, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';
import styled from '@emotion/styled';
import last from 'lodash.last';

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
import { clearInterval } from 'timers';

const TimeSandIcon = (props: any) => {
  return (
    <svg width={46} height={65} viewBox="0 0 46 65" fill="none" {...props}>
      <path
        d="M1 1h40m4 0h-4m0 0c3.5 25.5-13.5 29.5-16.5 31M5.16 1c-4 42 38.5 22 36 62.5M1 63.5h3.5m40.5 0H4.5m0 0c-.333-4.333-.3-13.8 2.5-17"
        stroke="#E05751"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PriceIcon = (props: any) => {
  return (
    <svg className="price" width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
      <path d="M10 19.5l5.1-5.1m1.9-1.9l-1.9 1.9m0 0c-.867.367-2.9.7-4.1-.9" stroke="#4A9ED8" strokeLinecap="round" />
      <path d="M13.5 1h10v11L11 24 1 14l8.5-8.5" stroke="#4A9ED8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2.5c-3-.5-4.5 3 0 2.5" stroke="#4A9ED8" strokeLinecap="round" />
    </svg>
  );
};

const BoxIcon = (props: any) => {
  return (
    <svg width={69} height={60} viewBox="0 0 69 60" fill="none" {...props}>
      <path
        d="M67.5 12.5L34 22m33.5-9.5V48L34 58m33.5-45.5L34 2 1 12.5M34 22v36m0-36L1 12.5M34 58L1 48V25.5m0-13V16"
        stroke="#4A9ED8"
        strokeWidth={2}
      />
    </svg>
  );
};

const EthStatsContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 1fr;

  background-color: #090909;
  border-radius: 20px;
  margin-bottom: 27px;
  font-family: 'Source Sans Pro', sans-serif;

  svg {
    margin-right: 22px;

    &.price {
      margin-right: 12px;
    }
  }

  .text-info {
    color: #10a0de;
  }

  .text-success {
    color: #7bcc3a;

    path {
      stroke: #7bcc3a;
    }
  }

  .text-warning {
    color: #ffd162;

    path {
      stroke: #ffd162;
    }
  }

  .text-orange {
    color: #ff8a00;

    path {
      stroke: #ff8a00;
    }
  }

  .text-danger {
    color: #f74b4b;

    path {
      stroke: #f74b4b;
    }
  }
`;

const EthStatContainer = styled.div`
  flex: 1;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  display: flex;
`;

const EthStatTitle = styled.p`
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 12px;
`;

const EthStatValue = styled.p`
  font-weight: 300;
  font-size: 50px;
  letter-spacing: -1px;
`;

const GasLimitContainer = styled.div`
  display: flex;
  padding: 7px 15px;
  justify-content: space-between;
  grid-area: 2 / 1 / 3 / 3;

  > div {
    display: flex;
  }
`;

const GasLimitValue = styled.p`
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 0;
`;

const lastBlockTimeClass = (time: number) => {
  if (time >= 0 && time < 15) return 'text-success';
  if (time < 20) return 'text-warning';
  if (time < 25) return 'text-orange';
  return 'text-danger';
};

const EthStats: FC = () => {
  const [gasLimit, setGasLimit] = useState<any>(undefined);
  const [bestBlock, setBestBlock] = useState<any>(undefined);
  const [lastBlockTime, setLastBlockTime] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastBlockTime((prevLastBlockTime: number) => prevLastBlockTime + 1);
    }, 1000);

    function getGasLimit() {
      let lastBlock = 0;
      let stampIndex = 0;
      let lastServerTime = 0;

      function run() {
        const socket = new WebSocket(`wss://ethstats.net/primus/?_primuscb=${+new Date()}-${stampIndex++}`);

        // Init connection
        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              emit: ['client-pong', { serverTime: lastServerTime, clientTime: +new Date() }],
            }),
          );

          socket.send(JSON.stringify({ emit: ['ready'] }));
        };

        // Listen for messages
        socket.addEventListener('message', function (event) {
          const parsedEvent = JSON.parse(event.data);

          if (parsedEvent?.action === 'charts') {
            lastServerTime = +new Date();

            const gasLimit = last(parsedEvent?.data?.gasLimit);
            const bestBlock = last(parsedEvent?.data?.height);

            if (bestBlock !== lastBlock) {
              setLastBlockTime(0);
            }

            setGasLimit(gasLimit);
            setBestBlock(bestBlock);
          }
        });
      }

      run();
      return setInterval(run, 50000);
    }

    const gasLimitIntervalId = getGasLimit();

    return () => {
      clearInterval(intervalId);
      clearInterval(gasLimitIntervalId);
    };
  }, []);

  return (
    <EthStatsContainer>
      <EthStatContainer>
        <BoxIcon />
        <div>
          <EthStatTitle>Best block</EthStatTitle>
          {bestBlock && (
            <EthStatValue className="text-info">#{new Intl.NumberFormat('en-US').format(bestBlock)}</EthStatValue>
          )}
        </div>
      </EthStatContainer>

      <EthStatContainer>
        <TimeSandIcon className={lastBlockTimeClass(lastBlockTime)} />
        <div>
          <EthStatTitle>Last block</EthStatTitle>
          <EthStatValue className={lastBlockTimeClass(lastBlockTime)}>{lastBlockTime}s ago</EthStatValue>
        </div>
      </EthStatContainer>

      <GasLimitContainer>
        <div>
          <PriceIcon />
          <EthStatTitle>gas limit</EthStatTitle>
        </div>
        {gasLimit && <GasLimitValue className="text-info">{gasLimit} gas</GasLimitValue>}
      </GasLimitContainer>
    </EthStatsContainer>
  );
};

const RaffleCreated: FC = () => {
  const [completeRaffle, setRaffle] = useState<CompleteRaffle | null>(null);

  // Router hooks
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

  // Effects
  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setRaffle(completeRaffles[0]);
  }, [raffle, events]); //eslint-disable-line

  // Constants
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
              <EthStats />
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
