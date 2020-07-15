import React, { FC } from 'react';
import { Tooltip } from 'antd';
import styled from '@emotion/styled';

// Types
import { PoapEvent } from 'lib/types';
type EventDisplayProps = {
  events: PoapEvent[];
};

// Styled components
const PoapContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  padding-bottom: 20px;
  div {
    margin: 5px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 60px;
    }
  }
`;

const EventDisplay: FC<EventDisplayProps> = ({ events }) => {
  return (
    <PoapContainer>
      {events.map((event) => {
        return (
          <div key={event.id}>
            <Tooltip title={event.name}>
              <img src={event.image_url} alt={event.name} />
            </Tooltip>
          </div>
        );
      })}
    </PoapContainer>
  );
};

export default EventDisplay;
