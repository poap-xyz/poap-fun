import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type ContainerProps = {
  sidePadding?: boolean;
  thinWidth?: boolean;
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  @media (min-width: ${({ thinWidth }) => (thinWidth ? BREAKPOINTS.sm : BREAKPOINTS.lg)}) {
    margin-right: auto;
    margin-left: auto;
    width: ${({ thinWidth }) => (thinWidth ? BREAKPOINTS.sm : BREAKPOINTS.lg)};
  }
  @media (max-width: ${({ thinWidth }) => (thinWidth ? BREAKPOINTS.sm : BREAKPOINTS.lg)}) {
    padding: ${({ sidePadding }) => (sidePadding ? '0 24px' : '0')};
  }
`;
