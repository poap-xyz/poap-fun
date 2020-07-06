import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

// Components
import Logo from 'ui/components/Logo';
import { Button } from 'ui/styled/antd/Button';

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
    width: 100%;
    display: flex;
    justify-content: space-between;
    @media (min-width: ${BREAKPOINTS.lg}) {
      margin-right: auto;
      margin-left: auto;
      width: ${BREAKPOINTS.lg};
    }
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

type HeaderProps = {
  isLoggedIn?: boolean;
  isAvatar?: boolean;
};

const Header: FC<HeaderProps> = ({ isLoggedIn, isAvatar }) => (
  <HeaderWrap>
    <div className={'container'}>
      <BrandNav>
        <NavLink to={ROUTES.home}>
          <Logo />
        </NavLink>
      </BrandNav>
      <Nav>
        <Button type="default">Connect Wallet</Button>
        <NavLink to={ROUTES.raffleCreation} className={'call-to-action'}>
          <Button type="primary">Create Raffle</Button>
        </NavLink>
      </Nav>
    </div>
  </HeaderWrap>
);

export default Header;
