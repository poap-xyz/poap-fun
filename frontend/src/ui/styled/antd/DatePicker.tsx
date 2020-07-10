import styled from '@emotion/styled';
import { DatePicker as AntdDatePicker } from 'antd';

type DatePickerProps = {
  fullWidth?: boolean;
};

export const DatePicker = styled(AntdDatePicker)<DatePickerProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : '140px')};
  border-color: var(--separator-color) !important;
  border-radius: 4px !important;
  height: 40px;

  .ant-picker-range {
    width: 100%;
    border-color: red !important;
  }

  .ant-picker-input {
    flex-direction: row-reverse;

    .ant-picker-suffix {
      color: var(--font-color);
      display: flex;
      margin-left: 0;
      margin-right: 10px;
    }

    & > input {
      color: var(--picker-color) !important;
      &::placeholder {
        color: var(--system-placeholder) !important;
        opacity: 1;
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

  &-dropdown {
    .ant-btn-primary {
      background-color: var(--secondary-color);
      border-color: var(--secondary-color);

      &[disabled] {
        color: rgba(0, 0, 0, 0.25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
      }
    }

    .ant-picker-footer {
      a {
        font-weight: 500;
        color: var(--secondary-color);

        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
`;
