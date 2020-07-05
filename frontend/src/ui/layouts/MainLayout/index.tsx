import React, { FC } from 'react';

// Components
import HeaderContent from 'ui/components/Header';
import { Layout, Header, Content } from 'ui/styled/antd/Layout';

const MainLayout: FC = ({ children }) => (
  <Layout>
    <Header>
      <HeaderContent />
    </Header>
    <Content>{children}</Content>
  </Layout>
);

export default MainLayout;
