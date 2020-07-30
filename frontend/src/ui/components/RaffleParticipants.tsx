import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useStateContext } from 'lib/hooks/useCustomState';

// Helpers
import { etherscanLinks } from 'lib/helpers/etherscan';

// Types
import { Participant, PoapEvent } from 'lib/types';

type RaffleParticipantsProps = {
  participants?: Participant[];
  isLoading: boolean;
  canJoin: boolean;
};

const Content = styled.div`
  padding: 30px 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    padding: 30px 100px;
  }

  .participant-box {
    background: var(--system-gray);
    border-radius: 12px;
    padding: 25px;

    .number-container {
      display: flex;
      align-items: center;
      flex-direction: column;

      img {
        width: 60px;
        height: 60px;
        border-radius: 20px;
        margin-bottom: 6px;
      }
    }

    .box-title {
      font-family: var(--alt-font);
      font-size: 16px;
      margin-bottom: 4px;

      &.upper {
        padding-top: 20px;
      }
    }
    .ticket-holder {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      margin: auto;
      max-width: 500px;

      @media (max-width: ${BREAKPOINTS.xs}) {
        grid-template-columns: 1fr 1fr 1fr;
      }

      div {
        text-align: center;
        color: var(--primary-color);
        font-size: 14px;
        line-height: 24px;
        padding: 3px 0;
      }
    }
  }
`;

const Title = styled.h3`
  text-align: center;
  color: var(--primary-color);
  font-family: var(--alt-font);
  font-weight: bold;
  font-size: 18px;
  padding: 20px 0;
`;

type ParticipantWithEvent = Participant & { event: PoapEvent };

const RaffleParticipants: FC<RaffleParticipantsProps> = ({ participants, isLoading, canJoin }) => {
  // Custom hooks
  const { isConnected, account } = useStateContext();

  // Query hooks
  const { data: events } = useEvents();

  if (!participants || !events) return <div />;

  // constants
  const participantsEventsIds = participants.map(({ event_id: eventId }) => eventId);

  const eventsFilteredById = events
    .filter(({ id }) => participantsEventsIds.includes(String(id)))
    .reduce((acc, event) => ({ ...acc, [event.id]: event }), {});

  const participantsWithEventData: ParticipantWithEvent[] = participants.map((participant) => ({
    ...participant,
    event: eventsFilteredById[participant.event_id],
  }));

  let accountTickets: ParticipantWithEvent[] = [];
  let otherTickets = participantsWithEventData;

  if (isConnected && account) {
    accountTickets = participantsWithEventData.filter((each) => each.address.toLowerCase() === account.toLowerCase());
    otherTickets = participantsWithEventData.filter((each) => each.address.toLowerCase() !== account.toLowerCase());
  }

  // Empty State
  if (participantsWithEventData.length === 0) {
    return (
      <Content>
        <Title>Nobody is participating yet.{canJoin && ` Be the first to join!`}</Title>
      </Content>
    );
  }

  return (
    <Spin spinning={isLoading} tip="Loading participants">
      <Content>
        <Title>Participating POAPs</Title>
        <div className={'participant-box'}>
          {accountTickets.length > 0 && (
            <div>
              <div className={'box-title'}>Your POAP{accountTickets.length > 1 ? 's' : ''}:</div>
              <div className={'ticket-holder'}>
                {accountTickets.map((each) => {
                  return (
                    <div key={each.id} className="number-container">
                      <img src={each.event.image_url} alt={each.event.name} />
                      <a href={etherscanLinks.poap(each.poap_id)}>#{each.poap_id.toString().padStart(5, '0')}</a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {accountTickets.length > 0 && otherTickets.length > 0 && (
            <div className={'box-title upper'}>Other POAP{otherTickets.length > 1 ? 's' : ''}:</div>
          )}
          <div className={'ticket-holder'}>
            {otherTickets.map((each) => {
              return (
                <div key={each.id} className="number-container">
                  <img src={each.event.image_url} alt={each.event.name} />
                  <a href={etherscanLinks.poap(each.poap_id)} target="_blank" rel="noopener noreferrer">
                    #{each.poap_id.toString().padStart(5, '0')}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </Content>
    </Spin>
  );
};

export default RaffleParticipants;
