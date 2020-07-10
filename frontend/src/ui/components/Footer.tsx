import React, { FC } from 'react';
import styled from '@emotion/styled';
// import { NavLink } from 'react-router-dom';

// Components
import BuiltOnEth from 'ui/components/BuiltOnEth';
import Community from 'ui/components/Community';
import Credits from 'ui/components/Credits';
import Logo from 'ui/components/Logo';
import { Container } from 'ui/styled/Container';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

const FooterWrap = styled.div`
  box-shadow: inset 0px 1px 0px #eaedf4;
  padding-top: 50px;
  .footer-table-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: ${BREAKPOINTS.xs}) {
      flex-direction: column-reverse;
    }

    .footer-table-cell {
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;

      @media (max-width: ${BREAKPOINTS.xs}) {
        padding: 10px 0;
      }

      .logo {
        width: 60px;
        margin-bottom: 20px;
      }
      .built-on-eth {
        width: 120px;
        margin: 0 auto;
      }
    }
  }
`;

const CreditsWrap = styled.div`
  width: 100%;
  text-align: center;
`;

const Footer: FC = () => (
  <FooterWrap>
    <Container>
      <div className={'footer-table-row'}>
        <div className={'footer-table-cell'}>
          <a href={'https://www.poap.xyz'} target={'_blank'} rel="noopener noreferrer">
            <Logo />
          </a>
          <BuiltOnEth />
        </div>
        <div className={'footer-table-cell'}>
          <Community />
        </div>
      </div>
      <CreditsWrap>
        <Credits />
      </CreditsWrap>
    </Container>
  </FooterWrap>
);

export default Footer;
