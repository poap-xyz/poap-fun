import React, { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

// Components
import CardWithBadges from 'ui/components/CardWithBadges';
import CountdownBox from 'ui/components/CountdownBox';

// Constants
import { DATETIMEFORMAT } from 'lib/constants/theme';

// Types
type CountdownProps = {
  datetime: string;
};
type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownWrapper = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  padding: 20px 0 10px;
  .countdown {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

const Countdown: FC<CountdownProps> = ({ datetime }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +moment.utc(datetime).toDate() - +moment.utc(new Date()).toDate();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const timeLeftString = moment.utc(datetime).local().format(DATETIMEFORMAT);

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  return (
    <CardWithBadges>
      <CountdownWrapper>
        <div className={'countdown'}>
          <CountdownBox number={timeLeft.days} unit={'Days'} />
          <CountdownBox number={timeLeft.hours} unit={'Hours'} />
          <CountdownBox number={timeLeft.minutes} unit={'Minutes'} />
          <CountdownBox number={timeLeft.seconds} unit={'Seconds'} />
        </div>
        <div>Time left before inscription ends</div>
        <div>{timeLeftString}</div>
      </CountdownWrapper>
    </CardWithBadges>
  );
};

export default Countdown;
