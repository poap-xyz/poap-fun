import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

// Components
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

// Assets
import Berlin from 'assets/img/cities/berlin.jpg';
import Gibraltar from 'assets/img/cities/gibraltar.jpg';
import London from 'assets/img/cities/london.jpg';
import Pittsburg from 'assets/img/cities/pittsburg.jpg';

const HeroWrap = styled.div`
  width: 100%;
  padding-top: 25px;
  position: relative;

  .title {
    text-align: center;
    padding: 100px 24px 300px;
    @media (max-width: ${BREAKPOINTS.sm}) {
      padding-bottom: 60px;
    }

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

  @media (min-width: ${BREAKPOINTS.sm}) {
    &.berlin {
      top: -120px;
    }
    &.gibraltar {
      top: -20px;
    }
    &.london {
      top: -170px;
    }
    &.pittsburg {
      top: -120px;
    }
  }
`;

const Hero: FC = () => {
  const backgrounds = [
    { image: Berlin, className: 'berlin' },
    { image: Gibraltar, className: 'gibraltar' },
    { image: London, className: 'london' },
    { image: Pittsburg, className: 'pittsburg' },
  ];
  const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  return (
    <HeroWrap>
      <div className={'title'}>
        <h1>What is POAP Fun all about?</h1>
        <h2>Create raffle for event participants!</h2>
        <NavLink to={ROUTES.raffleCreation}>
          <Button type="primary">Create Raffle</Button>
        </NavLink>
      </div>
      <Background alt={background.className.toUpperCase()} src={background.image} className={background.className} />
    </HeroWrap>
  );
};

export default Hero;
