import React, { FC } from 'react';
import { Tooltip } from 'antd';
import styled from '@emotion/styled';
import { FiLink } from 'react-icons/fi';

// Components
import { Card } from 'ui/styled/antd/Card';
import { Button } from 'ui/styled/antd/Button';
import PrizeRowForm from 'ui/components/PrizeRowForm';
import RaffleShareContent from 'ui/components/RaffleShareContent';
import Separator from 'ui/styled/Separator';

// Lib
import { useModal } from 'lib/hooks/useModal';

// Types
import { CompleteRaffle } from 'lib/types';
type RaffleContentProps = {
  raffle: CompleteRaffle;
};

const Content = styled.div`
  padding: 10px 0;
`;
const CardContent = styled.div`
  flex-direction: row;
  width: 100%;
  .description {
    padding: 20px 0;
  }
  .poaps {
    .poap-container {
      display: flex;
      flex-direction: row;
      div {
        margin: 0 5px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 60px;
        }
      }
    }
    p {
      margin: 10px 0 0;
      font-family: var(--mix-font);
      color: var(--font-color);
      font-size: 14px;
      line-height: 22px;
      opacity: 0.8;
    }
  }
`;
const Title = styled.h3`
  color: var(--primary-color);
  font-family: var(--alt-font);
  font-weight: bold;
  font-size: 18px;
`;
const Share = styled.div`
  text-align: right;
  font-family: var(--alt-font);
  color: var(--secondary-color);
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
`;

const RaffleContent: FC<RaffleContentProps> = ({ raffle }) => {
  const { showModal: handleShare } = useModal({
    component: RaffleShareContent,
    closable: true,
    className: '',
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    id: raffle.id,
  });

  return (
    <Content>
      <Card>
        <CardContent>
          <div>
            <Share onClick={handleShare}>
              Get sharable link <FiLink />
            </Share>
            <Title>Prize{raffle.prizes.length > 1 && `s`}</Title>
            <div>
              {raffle.prizes.map((prize) => (
                <PrizeRowForm order={prize.order} key={prize.order} prize={prize.name} />
              ))}
            </div>
          </div>
          <div className={'description'} dangerouslySetInnerHTML={{ __html: raffle.description }} />
          <Separator />
          <div className={'poaps'}>
            <Title>POAP{raffle.events.length > 1 && `s`} required</Title>
            <div className={'poap-container'}>
              {raffle.events.map((event) => {
                return (
                  <div key={event.id}>
                    <Tooltip title={event.name}>
                      <img src={event.image_url} alt={event.name} />
                    </Tooltip>
                  </div>
                );
              })}
            </div>
            <p>
              {!raffle.one_address_one_vote && `You need at least one, but having more means more chances!`}
              {raffle.one_address_one_vote && `You need at least one to participate!`}
            </p>
          </div>
        </CardContent>
      </Card>
    </Content>
  );
};

export default RaffleContent;
