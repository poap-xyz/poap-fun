import React, { FC } from 'react';

// Components
import HeaderContent from 'ui/components/Header';
import FooterContent from 'ui/components/Footer';
import { Layout, Header, Content, Footer } from 'ui/styled/antd/Layout';

// Types
type MainLayoutProps = {
  padded?: boolean;
};

const MainLayout: FC<MainLayoutProps> = ({ children, padded = true }) => (
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

export default MainLayout;
