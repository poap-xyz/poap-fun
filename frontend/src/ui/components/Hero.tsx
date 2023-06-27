import React, { FC } from 'react';
import styled from '@emotion/styled';

// Components
import { Tooltip } from 'antd';
import { Button } from 'ui/styled/antd/Button';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Assets
import Berlin from 'assets/img/cities/berlin.png';
import BuenosAires from 'assets/img/cities/buenosaires.png';
import SanFrancisco from 'assets/img/cities/francisco.png';
import Gibraltar from 'assets/img/cities/gibraltar.png';
import London from 'assets/img/cities/london.png';
import Moscow from 'assets/img/cities/moscow.png';
import Paris from 'assets/img/cities/paris.png';
import Pittsburg from 'assets/img/cities/pittsburg.png';
import Rio from 'assets/img/cities/rio.png';
import Shangai from 'assets/img/cities/shangai.png';
import Sydney from 'assets/img/cities/sydney.png';
import Toronto from 'assets/img/cities/toronto.png';

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

    h2 {
      color: var(--tertiary-color);
    }

    button {
      margin-top: 30px;
      width: 160px;

      &.disabled {
        color: var(--secondary-color) !important;
        background-color: var(--btn-disabled) !important;
        border-color: var(--btn-disabled) !important;
        cursor: not-allowed;
      }
    }
  }

  .btnWrapper {
  }

  img {
    width: 100%;
  }
`;

const Background = styled.img`
  position: absolute;
  top: 0;
  z-index: -1;
  opacity: 0.6;

  @media (min-width: ${BREAKPOINTS.sm}) {
    opacity: 1;
    &.berlin,
    &.pittsburg,
    &.buenos-aires,
    &.rio,
    &.shangai {
      top: -120px;
    }
    &.gibraltar,
    &.san-fran,
    &.toronto {
      top: -20px;
    }
    &.london,
    &.sydney {
      top: -170px;
    }
  }
  @media (min-width: ${BREAKPOINTS.xl}) {
    &.toronto,
    &.buenos-aires,
    &.san-fran {
      top: -160px;
    }
  }
`;

const Hero: FC = () => {
  const backgrounds = [
    { image: Berlin, className: 'berlin' },
    { image: BuenosAires, className: 'buenos-aires' },
    { image: SanFrancisco, className: 'san-fran' },
    { image: Gibraltar, className: 'gibraltar' },
    { image: London, className: 'london' },
    { image: Moscow, className: 'london' },
    { image: Paris, className: 'london' },
    { image: Pittsburg, className: 'pittsburg' },
    { image: Rio, className: 'rio' },
    { image: Shangai, className: 'shangai' },
    { image: Sydney, className: 'sydney' },
    { image: Toronto, className: 'toronto' },
  ];
  const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  return (
    <HeroWrap>
      <div className={'title'}>
        <h1>What is POAP Fun all about?</h1>
        <h2>Create raffle for event participants!</h2>
        <Tooltip title="POAP Fun is under maintenance" trigger={['hover']} mouseEnterDelay={0} mouseLeaveDelay={0}>
          <Button type="primary" className="disabled">
            Create Raffles
          </Button>
        </Tooltip>
      </div>
      <Background alt={background.className.toUpperCase()} src={background.image} className={background.className} />
    </HeroWrap>
  );
};

export default Hero;
