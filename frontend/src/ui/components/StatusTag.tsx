import React, { FC } from 'react';
import styled from '@emotion/styled';

// Helpers
import { isRaffleActive, isRaffleOnGoing, isRaffleFinished } from 'lib/helpers/raffles';

// Types
import { Raffle, CompleteRaffle } from 'lib/types';
type StatusTagProps = {
  raffle?: Raffle | CompleteRaffle;
  className?: string;
  text?: string;
};

// Styled component
const Tag = styled.div`
  width: 66px;
  height: 27px;
  text-align: center;
  font-family: var(--alt-font);
  font-size: 12px;
  line-height: 22px;
  padding: 2px;
  background: var(--primary-color);
  color: #ffffff;
  border-radius: 100px;
  &.active {
    background: #79cfbd;
    color: #ffffff;
  }
  &.finished {
    background: #eaedf4;
    color: #94a0d4;
  }
`;

const StatusTag: FC<StatusTagProps> = ({ raffle, className = '', text = '' }) => {
  if (raffle) {
    if (isRaffleActive(raffle)) text = 'Active';
    if (isRaffleOnGoing(raffle)) text = 'Ongoing';
    if (isRaffleFinished(raffle)) text = 'Finished';
  }
  return <Tag className={`${text.toLowerCase()} ${className}`}>{text}</Tag>;
};

export default StatusTag;
