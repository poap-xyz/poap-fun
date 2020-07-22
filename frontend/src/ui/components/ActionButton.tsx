import React, { FC } from 'react';
import styled from '@emotion/styled';

// Components
import { Button } from 'ui/styled/antd/Button';

// Types
type ActionButtonProps = {
  action: () => void;
  disabled: boolean;
  helpText: string;
};

// Styled Components
const Wrapper = styled.div`
  width: 100%;
  text-align: center;
`;
const HelpText = styled.div`
  text-align: center;
  font-style: italic;
  color: var(--secondary-color);
`;

const ActionButton: FC<ActionButtonProps> = ({ action, disabled, helpText }) => (
  <Wrapper>
    <Button type={'primary'} onClick={action} disabled={disabled}>
      Join Raffle
    </Button>
    {helpText && <HelpText>{helpText}</HelpText>}
  </Wrapper>
);

export default ActionButton;
