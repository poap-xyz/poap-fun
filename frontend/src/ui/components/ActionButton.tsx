import React, { FC } from 'react';
import { Tooltip } from 'antd';
import styled from '@emotion/styled';

// Components
import { Button } from 'ui/styled/antd/Button';

// Types
type ActionButtonProps = {
  text: string;
  action: () => void;
  disabled: boolean;
  loading: boolean;
  helpText: string;
};

// Styled Components
const Wrapper = styled.div`
  width: 100%;
  text-align: center;
`;
const DisabledButton = styled.div`
  cursor: not-allowed;
  width: 100%;
  color: var(--secondary-color) !important;
  background-color: var(--btn-disabled) !important;
  border-color: var(--btn-disabled) !important;
  letter-spacing: 0.3px;
  height: 40px !important;
  border-radius: 4px !important;
  font-family: var(--alt-font);
  line-height: 1.5715;
  padding: 8px 15px;
  font-size: 14px;
  margin: 0;
`;

const ActionButton: FC<ActionButtonProps> = ({ text, action, disabled, helpText, loading }) => {
  return (
    <Wrapper>
      {disabled && helpText && (
        <Tooltip title={helpText}>
          <DisabledButton>
            <span>{text}</span>
          </DisabledButton>
        </Tooltip>
      )}
      {!helpText && !disabled && (
        <Button type={'primary'} onClick={action} loading={loading}>
          {text}
        </Button>
      )}
    </Wrapper>
  );
};

export default ActionButton;
