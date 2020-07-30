import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

// Components
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';

// Assets
import BackgroundImage from 'assets/img/background.jpg';

const HeroWrap = styled.div`
  width: 100%;
  padding-top: 25px;
  position: relative;

  .title {
    text-align: center;
    padding: 100px 24px 60px;

    h1 {
    }

    h2 {
      color: var(--tertiary-color);
    }

    a {
      button {
        margin-top: 30px;
        width: 160px;
      }
    }
  }

  img {
    width: 100%;
  }
`;

const Background = styled.img`
  position: absolute;
  top: 0;
  z-index: -1;
`;

const Hero: FC = () => (
  <HeroWrap>
    <div className={'title'}>
      <h1>What is POAP Fun all about?</h1>
      <h2>Create raflle for event participants!</h2>
      <NavLink to={ROUTES.raffleCreation}>
        <Button type="primary">Create Raffle</Button>
      </NavLink>
    </div>
    <Background alt="POAP Fun" src={BackgroundImage} />
  </HeroWrap>
);

export default Hero;
