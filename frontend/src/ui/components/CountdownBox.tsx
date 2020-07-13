import React, { FC } from 'react';
import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Type
type CountdownBoxProps = {
  number: number;
  unit: string;
};

// Component
const BoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px;
  .unit {
    color: var(--system-placeholder);
    font-family: var(--mix-font);
    font-size: 12px;
    line-height: 18px;
    padding: 10px 0;
  }
`;
const Box = styled.div`
  width: 80px;
  height: 80px;

  @media (max-width: ${BREAKPOINTS.xs}) {
    width: 40px;
    height: 40px;
  }

  border-radius: 10px;
  background: var(--primary-color);
  div {
    color: var(--system-white);
    font-family: var(--main-font);
    font-size: 30px;
    margin-top: 17px;

    @media (max-width: ${BREAKPOINTS.xs}) {
      font-size: 18px;
      margin-top: 6px;
    }
  }
`;

const CountdownBox: FC<CountdownBoxProps> = ({ number, unit }) => {
  return (
    <BoxWrapper>
      <Box>
        <div>{number.toString().padStart(2, '0')}</div>
      </Box>
      <div className={'unit'}>{unit}</div>
    </BoxWrapper>
  );
};

export default CountdownBox;
