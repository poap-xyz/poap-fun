import React, { FC } from 'react';
import styled from '@emotion/styled';

// Types
type TitleSecondaryProps = {
  title: string;
};

// Styled component
const Title = styled.div`
  width: 100%;
  padding: 60px 0 24px;
  h3 {
    color: var(--primary-color);
    font-family: var(--alt-font);
    font-size: 28px;
    line-height: 38px;
  }
`;

const TitleSecondary: FC<TitleSecondaryProps> = ({ title }) => {
  return (
    <Title>
      <h3>{title}</h3>
    </Title>
  );
};

export default TitleSecondary;
