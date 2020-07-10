import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

// Components
import CardWithBadges from 'ui/components/CardWithBadges';

// Helpers
import { createRaffleLink } from 'lib/helpers/raffles';

// Assets
import Check from 'assets/img/Check.svg';

// Types
import { Raffle } from 'lib/types';
type RaffleCreatedCardProps = {
  raffle: Raffle;
};

const RaffleWrapper = styled.div`
  width: 100%;
  flex-direction: row;
  text-align: center;
  .title {
    h2 {
      margin-bottom: 5px;
    }
    img {
      width: 70px;
      margin: 20px;
    }
  }
  .code {
    font-size: 50px;
    color: var(--font-color);
    letter-spacing: 10px;
    padding: 10px 0;
  }
  .warning {
    p {
      margin: 0;
    }
  }
`;

const RaffleCreatedCard: FC<RaffleCreatedCardProps> = ({ raffle }) => {
  return (
    <CardWithBadges>
      <RaffleWrapper>
        <div className={'title'}>
          <img src={Check} alt={'Raffle created'} />
          <h2>Raffle Created!</h2>
          <NavLink to={createRaffleLink(raffle, true)}>{createRaffleLink(raffle, false)}</NavLink>
        </div>
        {/* TODO - UPDATE! */}
        <div className={'code'}>123456</div>
        <div className={'warning'}>
          <p>Save this code!</p>
          <p>You will need it in case you need to edit the raffle</p>
        </div>
      </RaffleWrapper>
    </CardWithBadges>
  );
};

export default RaffleCreatedCard;
