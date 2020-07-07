import React, { FC } from 'react';
import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type ContainerProps = {
  sidePadding?: boolean;
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  @media (min-width: ${BREAKPOINTS.lg}) {
    margin-right: auto;
    margin-left: auto;
    width: ${BREAKPOINTS.lg};
  }
  @media (max-width: ${BREAKPOINTS.lg}) {
    padding: ${({ sidePadding }) => (sidePadding ? '0 24px' : '0')};
  }
`;
