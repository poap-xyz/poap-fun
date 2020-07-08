import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Tooltip } from 'antd';
import { Card } from 'ui/styled/antd/Card';

// Components
import StatusTag from 'ui/components/StatusTag';

// Types
import { CompleteRaffle } from 'lib/types';
type RaffleCardProps = {
  raffle: CompleteRaffle;
};

// Styled component
const RaffleCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .card-top-row {
    .card-top-row-title {
      display: grid;
      grid-template-columns: auto 65px;
      h4 {
        color: var(--primary-color);
        font-family: var(--alt-font);
        font-size: 20px;
        line-height: 27px;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        -webkit-box-orient: vertical;
      }
    }

    h5 {
      color: var(--font-color);
      font-family: var(--alt-font);
      font-size: 14px;
      line-height: 19px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-bottom-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .bottom-title {
      font-family: var(--mix-font);
      color: var(--system-placeholder);
      font-size: 10px;
      line-height: 12px;
      margin-bottom: 10px;
    }

    .deadline {
      color: var(--font-color);
      background: var(--system-light-gray);
      border-radius: 6px;
      font-size: 10px;
      line-height: 12px;
      padding: 6px 10px;
    }
    .bottom-data {
      .badge {
        text-align: center;
        position: relative;
        div {
          width: 28px;
          height: 28px;
          padding: 1px;
          border-radius: 28px;
          border: 2px solid white;
          background: var(--system-light-gray);
          position: absolute;
          top: -3px;
          &:first-of-type {
            left: 0;
          }
          &:nth-of-type(2) {
            left: 20px;
          }
          &:nth-of-type(3) {
            left: 40px;
          }
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
`;

const RaffleCard: FC<RaffleCardProps> = ({ raffle }) => {
  return (
    <Card>
      <RaffleCardWrapper>
        <div className={'card-top-row'}>
          <div className={'card-top-row-title'}>
            <h4>{raffle.name}</h4>
            <StatusTag active={true} />
          </div>
          {raffle.prizes.length > 0 && <h5>{raffle.prizes[0].name}</h5>}
        </div>
        <div className={'card-bottom-row'}>
          <div>
            <div className={'bottom-title'}>Inscription deadline</div>
            <div className={'bottom-data'}>
              <div className={'deadline'}>{raffle.registration_deadline}</div>
            </div>
          </div>
          <div>
            <div className={'bottom-title'}>Elegible POAPs</div>
            <div className={'bottom-data'}>
              <div className={'badge'}>
                {raffle.events.slice(0, 3).map((badge) => {
                  return (
                    <div key={badge.id}>
                      <Tooltip title={badge.name}>
                        <img src={badge.image_url} alt={badge.name} />
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </RaffleCardWrapper>
    </Card>
  );
};

export default RaffleCard;
