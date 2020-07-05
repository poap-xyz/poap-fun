import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

// Components
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';

// Assets
import CoolPeople from 'assets/img/cool-people.svg';

const HeroWrap = styled.div`
  width: 100%;
  padding-top: 25px;
  .title {
    text-align: center;
    padding: 100px 0 60px;
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

const Hero: FC = () => (
  <HeroWrap>
    <div className={'title'}>
      <h1>What is POAP Fun all about?</h1>
      <h2>Create raflle por event participants!</h2>
      <NavLink to={ROUTES.raffleCreation}>
        <Button type="primary">Create Raffle</Button>
      </NavLink>
    </div>
    <img alt="POAP Fun" className="logo" src={CoolPeople} />
  </HeroWrap>
);

export default Hero;
