import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Card } from 'ui/styled/antd/Card';

// Components
import StatusTag from 'ui/components/StatusTag';

// Types
type RaffleCardProps = {
  title: string;
  prize: string;
  active: boolean;
};

// Styled component
const RaffleCardWrapper = styled.div`
  width: 100%;
  h4 {
    color: var(--primary-color);
    font-family: var(--alt-font);
    font-size: 20px;
    line-height: 27px;
    margin: 0;
  }

  h5 {
    color: var(--font-color);
    font-family: var(--alt-font);
    font-size: 14px;
    line-height: 19px;
  }
`;

const RaffleCard: FC<RaffleCardProps> = ({ title, prize, active }) => {
  return (
    <Card>
      <RaffleCardWrapper>
        <div className={'card-top-row'}>
          <h4>{title}</h4>
          <StatusTag active={active} />
        </div>
        <h5>{prize}</h5>
        <div className={'card-bottom-row'}>
          <div className={'card-bottom-cell'}>
            <div className={'bottom-title'}>Inscription deadline</div>
            <div className={'bottom-data deadline'}>
              <div className={'deadline'}>22-OCT-2020 CET</div>
            </div>
          </div>
          <div className={'card-bottom-cell'}>
            <div className={'bottom-title'}>Elegible POAPs</div>
            <div className={'bottom-data badges'}>
              <div className={'Badge'}>P</div>
              <div className={'Badge'}>O</div>
              <div className={'Badge'}>A</div>
            </div>
          </div>
        </div>
      </RaffleCardWrapper>
    </Card>
  );
};

export default RaffleCard;
