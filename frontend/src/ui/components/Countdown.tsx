import React, { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import moment from 'moment';

// Components
import CardWithBadges from 'ui/components/CardWithBadges';
import CountdownBox from 'ui/components/CountdownBox';
import { Button } from 'ui/styled/antd/Button';

// Constants
import { DATETIMEFORMAT } from 'lib/constants/theme';

// Types
type CountdownProps = {
  datetime: string;
  finishAction: () => void;
  action?: () => void;
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

const ButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  padding: 10px 0;
  button {
    width: 200px;
  }
`;

const Countdown: FC<CountdownProps> = ({ datetime, finishAction, action }) => {
  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const difference = +moment.utc(datetime).toDate() - +moment.utc(new Date()).toDate();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return null;
    }
    return timeLeft;
  });
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft());
  const [finished, setFinished] = useState<boolean>(false);
  const timeLeftString = moment.utc(datetime).local().format(DATETIMEFORMAT);
  const offset = moment().utcOffset() / 60;

  useEffect(() => {
    if (!finished) {
      const interval = setInterval(() => {
        const _timeLeft = calculateTimeLeft();
        if (_timeLeft) {
          setTimeLeft(_timeLeft);
        } else {
          finishAction();
          setFinished(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return;
  }, [calculateTimeLeft, finishAction, finished]);

  if (!timeLeft) return <div />;

  return (
    <CardWithBadges>
      <CountdownWrapper>
        <div>Time left before raffle starts</div>
        <div className={'countdown'}>
          <CountdownBox number={timeLeft.days} unit={'Days'} />
          <CountdownBox number={timeLeft.hours} unit={'Hours'} />
          <CountdownBox number={timeLeft.minutes} unit={'Minutes'} />
          <CountdownBox number={timeLeft.seconds} unit={'Seconds'} />
        </div>
        <div>
          {timeLeftString} (UTC {offset > 0 ? `+${offset}` : offset})
        </div>
        {action && (
          <ButtonWrapper>
            <Button onClick={action} type={'primary'}>
              Start raffle now!
            </Button>
          </ButtonWrapper>
        )}
      </CountdownWrapper>
    </CardWithBadges>
  );
};

export default Countdown;
