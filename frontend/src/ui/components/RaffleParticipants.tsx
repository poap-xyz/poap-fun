import React, { FC } from 'react';
import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type RaffleParticipantsProps = {
  participants: number[];
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

const RaffleParticipants: FC<RaffleParticipantsProps> = ({ participants }) => {
  if (participants.length === 0) return <div />;

  return (
    <Content>
      <Title>This POAPs are already participating</Title>
      <div className={'participant-box'}>
        {participants.map((each) => {
          return <div key={each}>#{each.toString().padStart(5, '0')}</div>;
        })}
      </div>
    </Content>
  );
};

export default RaffleParticipants;
