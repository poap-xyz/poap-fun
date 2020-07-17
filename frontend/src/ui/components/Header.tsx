import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Popover } from 'antd';
import { NavLink } from 'react-router-dom';

// Components
import Logo from 'ui/components/Logo';
import PoapUser from 'ui/components/PoapUser';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

const HeaderWrap = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: var(--system-white);
  box-shadow: 0px 4px 20px rgba(101, 52, 255, 0.2);

  @media (max-width: ${BREAKPOINTS.xs}) {
    height: 60px;
  }

  .container {
    display: flex;
    justify-content: space-between;
  }
`;

const BrandNav = styled.div`
  height: 100%;
  img {
    position: absolute;
    top: 20px;
    height: 110px;
    @media (max-width: ${BREAKPOINTS.xs}) {
      height: 60px;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  & button {
    margin: 0 6px;
    width: 160px;
  }
  .call-to-action {
    @media (max-width: ${BREAKPOINTS.sm}) {
      display: none;
    }
  }
`;

const PoapDisplay = styled.div`
  .scroller {
    max-height: 250px;
    width: 300px;
    padding: 10px;
    margin-bottom: 20px;
    overflow: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overscroll-behavior: none;
    .badge {
      width: 80px;
      height: 80px;
      margin: 0 auto 10px;
      border-radius: 6px;
      box-shadow: 0px 4px 4px rgba(187, 196, 239, 0.34);
      padding: 10px;
      img {
        width: 100%;
      }
    }
  }
`;

type HeaderProps = {
  isLoggedIn?: boolean;
};

const Header: FC<HeaderProps> = ({ isLoggedIn = true }) => {
  let content = (
    <PoapDisplay>
      <div className={'scroller'}>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
        <div className={'badge'}>
          <img
            src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
            alt={'Poap'}
          />
        </div>
      </div>
      <Button type={'primary'}>Disconnect Wallet</Button>
    </PoapDisplay>
  );
  return (
    <HeaderWrap>
      <Container className={'container'}>
        <BrandNav>
          <NavLink to={ROUTES.home}>
            <Logo />
          </NavLink>
        </BrandNav>
        <Nav>
          {!isLoggedIn && <Button type="default">Connect Wallet</Button>}
          <Popover placement={'bottom'} title={'My POAPs'} content={content}>
            <div>
              <PoapUser />
            </div>
          </Popover>
          <NavLink to={ROUTES.raffleCreation} className={'call-to-action'}>
            <Button type="primary">Create Raffle</Button>
          </NavLink>
        </Nav>
      </Container>
    </HeaderWrap>
  );
};

export default Header;
