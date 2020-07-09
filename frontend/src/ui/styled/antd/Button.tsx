import styled from '@emotion/styled';
import { Button as AntdButton } from 'antd';

type ButtonProps = {
  width?: number;
  width160?: boolean;
  margin?: boolean;
};

export const Button = styled(AntdButton)<ButtonProps>`
  background: var(--system-white);
  border: 1px solid var(--separator-color) !important;
  border-radius: 4px !important;
  font-family: var(--alt-font);
  font-weight: 400 !important;
  letter-spacing: 0.3px;
  height: 40px !important;
  width: ${({ width }) => (width ? width + 'px' : '100%')};
  margin: ${({ margin }) => (margin ? '24px 0' : '0')};

  &.ant-btn-loading {
    position: absolute;
  }

  &:hover {
    color: var(--secondary-color) !important;
    border: 1px solid var(--secondary-color) !important;
  }

  &:disabled {
    color: var(--font-color) !important;
    background-color: var(--btn-disabled) !important;
    border-color: var(--btn-disabled) !important;
  }

  &.ant-btn {
    &.ant-btn-default {
      color: var(--secondary-color) !important;
      border-color: var(--system-gray) !important;

      &:hover {
        color: var(--secondary-color) !important;
        border-color: var(--secondary-color) !important;
      }
    }

    &-sm {
      width: 80px;
      min-width: 0;
      height: 32px !important;
    }

    &-lg {
      min-width: 174px;
    }
  }

  &.ant-btn-link {
    border: 0 !important;
    color: var(--secondary-color) !important;

    &:hover {
      color: var(--dark-secondary-color) !important;
    }
  }

  &.ant-btn-primary {
    font-weight: normal !important;
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;

    &:hover {
      color: var(--system-white) !important;
      background-color: var(--dark-secondary-color) !important;
      border-color: var(--dark-secondary-color) !important;
    }

    &:disabled {
      color: var(--font-color) !important;
      background-color: var(--btn-disabled) !important;
      border-color: var(--btn-disabled) !important;
    }
  }

  &.ant-btn-secondary {
    color: var(--font-color) !important;
  }

  &.ant-btn-dangerous {
    color: var(--error-border) !important;
    background-color: var(--btn-disabled) !important;
    border-color: var(--btn-disabled) !important;

    &:hover {
      color: var(--system-white) !important;
      background-color: var(--error-border) !important;
      border-color: var(--error-border) !important;
    }
  }

  &.btn-icon {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    color: var(--font-color);
    border: 1px solid var(--font-color) !important;
    min-width: ${({ width160 }) => (width160 ? '160px' : '110px')};

    &:hover {
      border-color: var(--secondary-color) !important;
      color: var(--secondary-color);
    }

    &.ant-btn-primary {
      color: var(--system-white);
      border-color: var(--secondary-color) !important;

      &:hover {
        color: var(--system-white) !important;
        border-color: var(--dark-secondary-color) !important;
      }
    }

    &.plus {
      flex-direction: row-reverse;
    }

    &.default {
      color: var(--font-color) !important;
      border-color: var(--font-color) !important;

      &:hover {
        color: var(--secondary-color) !important;
        border-color: var(--secondary-color) !important;
      }
    }
  }

  &.btn-modal {
    color: var(--label-input);
    width: 100%;
    border-radius: 0 !important;
    box-shadow: none;
    border: 0 !important;
    border-bottom: 1px solid var(--separator-color) !important;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    transition: all cubic-bezier(0.15, 0.82, 1, 1) 0.3s;
    position: relative;
    margin-bottom: 16px;

    svg {
      color: var(--font-color);
      font-size: 18px;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      transform: scaleX(0);
      -webkit-transform-origin: 0% 0%;
      transform-origin: 0% 0%;
      -webkit-transition: 0.5s ease all;
      transition: 0.5s ease all;
      background-color: var(--secondary-color);
    }

    &:hover::after {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
    }
  }
`;
