import styled from '@emotion/styled';
import { Form as AntdForm } from 'antd';

export const Form = styled.form`
  color: var(--font-color);

  .ant-form-item-has-error {
    .ant-input-number,
    .ant-picker {
      border-color: var(--error-border) !important;
    }

    .ant-input {
      border-color: var(--error-border) !important;
    }

    .ant-input-affix-wrapper {
      border-color: var(--error-border) !important;
    }

    .ant-input-group-addon {
      color: var(--label-input) !important;
    }

    .ant-form-item-explain,
    .ant-form-item-split {
      color: var(--error-border) !important;
      font-family: var(--alt-font);
      line-height: 24px;
      font-size: 12px;
      text-align: left;
    }
  }

  .ant-form-item {
    display: block;

    &.pt-20 {
      padding-top: 20px;
    }

    & > .ant-form-item-label {
      display: block;
      text-align: left;
      height: 26px;

      & > label {
        font-family: var(--alt-font);
        color: var(--label-input);
        font-weight: 500;
        line-height: 22px;
        display: block;

        &::before,
        &::after {
          display: none;
        }
      }
    }
  }
`;

export const { Item } = AntdForm;
