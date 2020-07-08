import React, { FC } from 'react';

// Components
import HeaderContent from 'ui/components/Header';
import FooterContent from 'ui/components/Footer';
import { Layout, Header, Content, Footer } from 'ui/styled/antd/Layout';

const MainLayout: FC = ({ children }) => (
  <Layout>
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
