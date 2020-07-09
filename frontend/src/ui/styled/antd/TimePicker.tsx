import styled from '@emotion/styled';
import { TimePicker as TimePickerAntd } from 'antd';

type TimePickerProps = {
  fullWidth: boolean;
};

export const TimePicker = styled(TimePickerAntd)<TimePickerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '140px')};
  border-color: var(--separator-color) !important;
  border-radius: 4px !important;
  height: 40px;

  .ant-picker-input {
    .ant-picker-suffix {
      color: var(--font-color);
      display: flex;
      margin-left: 0;
    }

    & > input {
      color: var(--picker-color) !important;

      &::placeholder {
        color: var(--system-placeholder) !important;
      }
    }
  }

  &.ant-picker-focused {
    box-shadow: none !important;
    border-color: var(--secondary-color) !important;
  }

  &.ant-picker.ant-picker-disabled {
    background: var(--btn-disabled) !important;
    border-color: var(--separator-color) !important;

    .ant-picker-input {
      & > input {
        color: var(--font-color) !important;
      }
    }
  }

  .ant-calendar-picker-input {
    font-size: 14px;
  }
`;
