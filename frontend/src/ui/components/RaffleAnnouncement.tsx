import React, { FC } from 'react';
import styled from '@emotion/styled';

// Components
import CardWithBadges from 'ui/components/CardWithBadges';

// Constants

// Types
type AnnouncementProps = {
  message: string;
};

// Styled components
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  flex-direction: column;
  padding: 20px 0 10px;
  .message {
    justify-content: center;
    h2,
    h3 {
      color: var(--font-color) !important;
    }
  }
`;

const RaffleAnnouncement: FC<AnnouncementProps> = ({ message }) => {
  return (
    <CardWithBadges>
      <Wrapper>
        <div className={'message'}>
          <h3>Raffle's start datetime is pending</h3>
          <h2>{message}</h2>
        </div>
      </Wrapper>
    </CardWithBadges>
  );
};

export default RaffleAnnouncement;
