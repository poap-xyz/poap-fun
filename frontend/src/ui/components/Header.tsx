import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Popover } from 'antd';
import { NavLink } from 'react-router-dom';

// Hooks
import { useStateContext } from 'lib/hooks/useCustomState';

// Components
import Logo from 'ui/components/Logo';
import PoapUser from 'ui/components/PoapUser';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

// Helpers
import { etherscanLinks } from 'lib/helpers/etherscan';

// Types
import { UserPoap } from 'lib/types';

type ScrollerProps = {
  grid: boolean;
};

// Styled components
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
  .faqs {
    margin-left: 20px;
  }
`;
const PoapDisplay = styled.div<ScrollerProps>`
  .scroller {
    max-height: 250px;
    width: 300px;
    padding: 10px;
    margin-bottom: 20px;
    overflow: auto;
    display: grid;
    grid-template-columns: ${({ grid }) => (grid ? '1fr 1fr 1fr' : '1fr')};
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
    .empty {
      width: 100%;
      text-align: center;
      font-size: 18px;
      color: var(--secondary-color);
      font-family: var(--alt-font);
      padding: 10px 0;
    }
  }
`;

const Header: FC = () => {
  const { isConnected, connectWallet, disconnectWallet, poaps, isFetchingPoaps, account } = useStateContext();

  let content = (
    <PoapDisplay grid={!!(poaps && poaps.length > 0)}>
      <div className={'scroller'}>
        {poaps && (
          <>
            {poaps.map((poap: UserPoap) => (
              <a
                href={etherscanLinks.addressPoapInventory(account)}
                target={'_blank'}
                key={poap.tokenId}
                rel="noopener noreferrer"
              >
                <div className={'badge'}>
                  <img src={poap.event.image_url} alt={poap.event.name} />
                </div>
              </a>
            ))}
            {poaps.length === 0 && <div className={'empty'}>No POAPs found</div>}
          </>
        )}
      </div>
      <Button type={'primary'} onClick={disconnectWallet}>
        Disconnect Wallet
      </Button>
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
          {!isConnected && (
            <Button type="default" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
          {isConnected && !isFetchingPoaps && (
            <>
              <Popover placement={'bottom'} title={'My POAPs'} content={content} trigger={['hover', 'click']}>
                <div>
                  <PoapUser />
                </div>
              </Popover>
            </>
          )}
          <NavLink to={ROUTES.raffleCreation} className={'call-to-action'}>
            <Button type="primary">Create Raffle</Button>
          </NavLink>
          <NavLink to={ROUTES.faqs} className={'faqs'}>
            FAQ
          </NavLink>
        </Nav>
      </Container>
    </HeaderWrap>
  );
};

export default Header;
