import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

const SpinContainer = styled.div`
  width: 100%;
  text-align: center;
  padding: 50px 0;
`;

const Loading: FC = () => (
  <SpinContainer>
    <Spin tip={'Loading...'} />
  </SpinContainer>
);

export default Loading;
