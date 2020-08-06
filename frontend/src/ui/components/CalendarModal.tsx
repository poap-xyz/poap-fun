import React from 'react';
import moment from 'moment';
import styled from '@emotion/styled';
import { FaGoogle, FaApple, FaYahoo, FaMicrosoft } from 'react-icons/fa';

// Hooks
import { useRaffle } from 'lib/hooks/useRaffle';

// Helpers
import { buildUrl } from 'lib/helpers/calendar';
import { createRaffleLink } from 'lib/helpers/raffles';

// Types
import { CalendarEvent } from 'lib/types';

// Styled Components
const CalendarIcons = styled.div`
  padding: 20px 0;
  text-align: center;
  a {
    color: var(--font-color) !important;
    .provider {
      border-radius: 4px;
      border: 1px solid var(--system-placeholder);
      padding: 5px 10px;
      margin: 10px auto;
      width: 200px;
      cursor: pointer;
      position: relative;
      p {
        margin: 0;
        height: 20px;
      }

      svg {
        height: 20px;
        position: absolute;
        left: 10px;
      }
    }
  }
`;

const CalendarModal = ({ id }: { id: number }) => {
  const { data: raffle } = useRaffle({ id });

  if (!raffle || !raffle.draw_datetime) return <div />;

  const endTime = moment(raffle.draw_datetime).add(10, 'minutes');
  const event: CalendarEvent = {
    title: 'POAP.fun raffle',
    description: `The raffle "${raffle.name}" will start, tune in!`,
    location: createRaffleLink(raffle, false),
    startTime: raffle.draw_datetime,
    endTime: endTime.format(),
  };
  const options = [
    {
      icon: <FaGoogle />,
      name: 'Google',
      url: buildUrl(event, 'google'),
    },
    {
      icon: <FaApple />,
      name: 'Apple Calendar',
      url: buildUrl(event, 'apple'),
    },
    {
      icon: <FaYahoo />,
      name: 'Yahoo',
      url: buildUrl(event, 'yahoo'),
    },
    {
      icon: <FaMicrosoft />,
      name: 'Outlook',
      url: buildUrl(event, 'outlook'),
    },
  ];

  return (
    <>
      <div>Choose any from below:</div>
      <CalendarIcons>
        {options.map((each) => {
          return (
            <a href={each.url} target={'_blank'} rel="noopener noreferrer">
              <div key={each.name} className={'provider'}>
                <p>
                  {each.icon} {each.name}
                </p>
              </div>
            </a>
          );
        })}
      </CalendarIcons>
    </>
  );
};

export default CalendarModal;
