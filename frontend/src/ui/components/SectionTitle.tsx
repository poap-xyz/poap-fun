import React, { FC } from 'react';
import styled from '@emotion/styled';

// Types
type SectionTitleProps = {
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

const SectionTitle: FC<SectionTitleProps> = ({ title }) => {
  return (
    <Title>
      <h3>{title}</h3>
    </Title>
  );
};

export default SectionTitle;
