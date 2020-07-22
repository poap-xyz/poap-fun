import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Hooks
import { useStateContext } from 'lib/hooks/useCustomState';

// Types
import { Participant } from 'lib/types';

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

    .box-title {
      font-family: var(--alt-font);
      font-size: 16px;
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

const RaffleParticipants: FC<RaffleParticipantsProps> = ({ participants, isLoading, canJoin }) => {
  const { isConnected, account } = useStateContext();

  if (!participants) return <div />;

  let accountTickets: Participant[] = [];
  let otherTickets: Participant[] = participants;
  if (isConnected && account) {
    accountTickets = participants.filter((each) => each.address.toLowerCase() === account.toLowerCase());
    otherTickets = participants.filter((each) => each.address.toLowerCase() !== account.toLowerCase());
  }

  // Empty State
  if (participants.length === 0) {
    return (
      <Content>
        <Title>No registered participants yet.{canJoin && ` Be the first to join!`}</Title>
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
              <div className={'box-title'}>Your numbers:</div>
              <div className={'ticket-holder'}>
                {accountTickets.map((each) => {
                  return (
                    <div key={each.id}>
                      <b>#{each.poap_id.toString().padStart(5, '0')}</b>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {accountTickets.length > 0 && <div className={'box-title upper'}>Other numbers:</div>}
          <div className={'ticket-holder'}>
            {otherTickets.map((each) => {
              return <div key={each.id}>#{each.poap_id.toString().padStart(5, '0')}</div>;
            })}
          </div>
          {accountTickets.length > 0 && otherTickets.length > 0 && (
            <div className={'box-title upper'}>Other numbers:</div>
          )}
          <div className={'ticket-holder'}>
            {otherTickets.map((each) => {
              return <div key={each.id}>#{each.poap_id.toString().padStart(5, '0')}</div>;
            })}
          </div>
        </div>
      </Content>
    </Spin>
  );
};

export default RaffleParticipants;
