import React, { FC, useMemo, ReactNode } from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import { Tooltip } from 'antd';
import { Card } from 'ui/styled/antd/Card';
import { NavLink } from 'react-router-dom';

// Components
import StatusTag from 'ui/components/StatusTag';

// Constants
import { DATETIMEFORMAT } from 'lib/constants/theme';

// Helpers
import { createRaffleLink } from 'lib/helpers/raffles';

// Types
import { CompleteRaffle, PoapEvent } from 'lib/types';
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
      text-align: center;
      background: var(--system-gray);
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
          border-radius: 28px;
          border: 2px solid white;
          background: var(--system-gray);
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
            border-radius: 20px;
          }
        }
        .more {
          padding-top: 0.5px;
          span {
            font-family: var(--alt-font);
          }
        }
      }
    }
  }
`;

const RaffleCard: FC<RaffleCardProps> = ({ raffle }) => {
  let mainEvents: PoapEvent[] = raffle.events.length <= 3 ? raffle.events : raffle.events.slice(0, 2);
  let otherEvents: PoapEvent[] = raffle.events.length <= 3 ? [] : raffle.events.slice(2);
  let otherEventsTooltip: ReactNode = useMemo(() => {
    return (
      <div>
        {otherEvents.slice(0, 10).map((event) => (
          <div>&bull; {event.name}</div>
        ))}
        {otherEvents.length > 10 && <div>& more!!!</div>}
      </div>
    );
  }, [otherEvents]);
  return (
    <NavLink to={createRaffleLink(raffle, true)}>
      <Card height={170}>
        <RaffleCardWrapper>
          <div className={'card-top-row'}>
            <div className={'card-top-row-title'}>
              <h4>{raffle.name}</h4>
              <StatusTag raffle={raffle} />
            </div>
            {raffle.prizes.length > 0 && <h5>{raffle.prizes[0].name}</h5>}
          </div>
          <div className={'card-bottom-row'}>
            <div>
              <div className={'bottom-title'}>Inscription deadline</div>
              <div className={'bottom-data'}>
                <div className={'deadline'}>
                  {raffle.draw_datetime
                    ? moment.utc(raffle.draw_datetime).local().format(DATETIMEFORMAT)
                    : 'To be announced'}
                </div>
              </div>
            </div>
            <div>
              <div className={'bottom-title'}>Elegible POAPs</div>
              <div className={'bottom-data'}>
                <div className={'badge'}>
                  {mainEvents.map((badge) => {
                    return (
                      <div key={badge.id} className={'badge-event'}>
                        <Tooltip title={badge.name}>
                          <img src={badge.image_url} alt={badge.name} />
                        </Tooltip>
                      </div>
                    );
                  })}
                  {otherEvents.length > 0 && (
                    <div className={'more'}>
                      <Tooltip title={otherEventsTooltip}>
                        <span className={'badge-more'}>{`+${otherEvents.length > 100 ? 99 : otherEvents.length}`}</span>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </RaffleCardWrapper>
      </Card>
    </NavLink>
  );
};

export default RaffleCard;
