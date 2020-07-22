import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
import { Participant } from 'lib/types';

type RaffleParticipantsProps = {
  participants?: Participant[];
  isLoading: boolean;
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
`;

const Title = styled.h3`
  text-align: center;
  color: var(--primary-color);
  font-family: var(--alt-font);
  font-weight: bold;
  font-size: 18px;
  padding: 20px 0;
`;

const RaffleParticipants: FC<RaffleParticipantsProps> = ({ participants, isLoading }) => {
  return (
    <Spin spinning={isLoading} tip="Loading participants">
      <Content>
        <Title>This POAPs are already participating</Title>
        <div className={'participant-box'}>
          {participants?.map(({ id, poap_id: poapId }) => {
            return <div key={id}>#{poapId.padStart(5, '0')}</div>;
          })}
        </div>
      </Content>
    </Spin>
  );
};

export default RaffleParticipants;
