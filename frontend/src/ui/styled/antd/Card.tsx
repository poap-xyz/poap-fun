import styled from '@emotion/styled';
import { Card as AntdCard } from 'antd';

export const Card = styled(AntdCard)`
  height: 170px;
  box-shadow: 0px 4px 18px rgba(101, 52, 255, 0.15);
  border-radius: 20px;
  margin: 8px 0;

  .ant-card-body {
    width: 100%;
    height: 100%;

    display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
  }
`;
