import React, { FC } from 'react';
import styled from '@emotion/styled';
// import { NavLink } from 'react-router-dom';

// Components
import BuiltOnEth from 'ui/components/BuiltOnEth';
import Community from 'ui/components/Community';
import Logo from 'ui/components/Logo';
import About from 'ui/components/About';
import { Container } from 'ui/styled/Container';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

const FooterWrapper = styled.div`
  box-shadow: inset 0px 1px 0px #eaedf4;
  display: flex;
  flex-direction: column;
  background: white;
  z-index: 2;
  position: relative;
`;
const FooterContent = styled.div`
  padding: 50px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: ${BREAKPOINTS.xs}) {
    padding: 50px 0 0 !important;
  }
  @media (max-width: ${BREAKPOINTS.md}) {
    padding: 30px 24px 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    row-gap: 52px;
    column-gap: 10px;
  }
  @media (max-width: ${BREAKPOINTS.lg}) {
    padding: 50px 20px;
  }
`;
const LogoContainer = styled.div`
  grid-area: 1 / 1 / 2 / 2;
  @media (max-width: ${BREAKPOINTS.md}) {
    grid-area: 3 / 1 / 3 / 1;
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }
  img {
    width: 59px;
    height: 78px;
    @media (min-width: ${BREAKPOINTS.md}) {
      width: 49px;
      height: 65px;
    }
  }
`;

const Footer: FC = () => (
  <FooterWrapper>
    <Container>
      <FooterContent>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <About />
        <Community />
      </FooterContent>
    </Container>
    <BuiltOnEth />
  </FooterWrapper>
);

export default Footer;
