import React, { FC, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Components
import HeaderContent from 'ui/components/Header';
import FooterContent from 'ui/components/Footer';
import { Layout, Header, Content, Footer } from 'ui/styled/antd/Layout';

// Types
type MainLayoutProps = {
  padded?: boolean;
};

const MainLayout: FC<MainLayoutProps> = ({ children, padded = true }) => {
  const location = useLocation();
  // Scroll to top if path changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout padded={padded}>
      <Header>
        <HeaderContent />
      </Header>
      <Content>{children}</Content>
      <Footer>
        <FooterContent />
      </Footer>
    </Layout>
  );
};

export default MainLayout;
