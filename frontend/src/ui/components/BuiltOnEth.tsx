import React, { FC } from 'react';
import styled from '@emotion/styled';

// assets
import BuiltOnEthereum from 'assets/img/built-on-ethereum.png';

const BuiltContainer = styled.div`
  width: 100%;
  text-align: center;
  background: var(--system-grey);
  img {
    height: 30px;
    margin: 0 auto;
  }
`;

const BuiltOnEth: FC = () => {
  return (
    <BuiltContainer>
      <img src={BuiltOnEthereum} alt={'Built on Ethereum'} />
    </BuiltContainer>
  );
};

export default BuiltOnEth;
