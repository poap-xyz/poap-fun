import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

export const SearchForm = styled.div`
  width: 100%;
  @media (min-width: ${BREAKPOINTS.sm}) {
    width: 300px;
  }
`;
