import styled from '@emotion/styled';

import { Input as InputAntd } from 'antd';

export const Input = styled(InputAntd)`
  border-radius: 4px !important;
  border-color: var(--separator-color) !important;
  color: var(--success-font-color) !important;

  &::placeholder {
    color: var(--system-placeholder) !important;
    opacity: 1;
  }

  &:hover,
  &:focus,
  &.ant-input-focused {
    border-color: var(--secondary-color) !important;
    box-shadow: none !important;
  }

  &[disabled] {
    color: var(--font-color) !important;
    background-color: var(--btn-disabled) !important;

    &:hover {
      border-color: var(--separator-color) !important;
    }
  }

  &.ant-input {
    &-affix-wrapper {
      .ant-input-prefix {
        display: flex;
        align-items: center;
        margin-right: 9px;
        color: var(--font-color);
      }

      input {
        color: var(--input-color) !important;

        &::placeholder {
          color: var(--system-placeholder) !important;
          opacity: 1;
        }
      }
    }

    &-affix-wrapper-focused {
      border-color: var(--secondary-color) !important;
      box-shadow: none !important;
    }

    &-affix-wrapper-disabled {
      color: var(--font-color) !important;
      background-color: var(--btn-disabled) !important;

      &:hover {
        border-color: var(--separator-color) !important;
      }
    }
  }

  &.optional {
    .ant-input-group-addon {
      &::after {
        content: 'Opcional';
        color: var(--font-color);
        font-style: italic;
        font-weight: normal;
        font-size: 10px;
        line-height: 22px;
        margin: 0 5px;
      }
    }
  }
  .ant-input-group,
  .ant-input-password .ant-input-group {
    display: block;

    &-addon {
      font-family: var(--alt-font);
      color: var(--label-input);
      font-weight: 500;
      background-color: transparent;
      border: 0;
      padding-bottom: 4px;
      padding-left: 0;
    }

    .ant-input {
      border-radius: 4px !important;
      border-color: var(--separator-color) !important;
      color: var(--success-font-color) !important;

      &::placeholder {
        color: var(--system-placeholder) !important;
        opacity: 1;
      }

      &:hover,
      &:focus,
      &.ant-input-focused {
        border-color: var(--secondary-color) !important;
        box-shadow: none !important;
      }

      &[disabled] {
        color: var(--font-color) !important;
        background-color: var(--btn-disabled) !important;

        &:hover {
          border-color: var(--separator-color) !important;
        }
      }
    }

    .ant-input-lg {
      font-size: 14px !important;
    }
  }
`;

export const { TextArea } = (Input as any).__emotion_base;
export const { Group } = (Input as any).__emotion_base;
