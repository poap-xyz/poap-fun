import React, { FC } from 'react';
import styled from '@emotion/styled';

// Assets
import Badges from 'assets/img/badges-party.svg';

// Components
const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  img {
    width: 100%;
    max-width: 500px;
  }
`;

const BadgeParty: FC = () => (
  <Wrapper>
    <img alt="POAP Fun" className="logo" src={Badges} />
  </Wrapper>
);

export default BadgeParty;
