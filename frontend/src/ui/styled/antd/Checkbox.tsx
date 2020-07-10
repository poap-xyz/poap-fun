import styled from '@emotion/styled';
import { Checkbox as AntdCheckbox } from 'antd';

export const Checkbox = styled(AntdCheckbox)`
  .ant-checkbox {
    &-inner {
      border-color: var(--font-color);
    }

    & + span {
      color: var(--picker-color);
    }

    &-checked {
      .ant-checkbox-inner {
        background-color: var(--secondary-color);
        border-color: var(--secondary-color);
      }

      &::after {
        border-color: var(--secondary-color);
      }
    }

    &-wrapper {
      &:hover {
        .ant-checkbox-inner {
          border-color: var(--secondary-color) !important;
        }
      }

      &.ant-checkbox-wrapper-disabled {
        .ant-checkbox-disabled {
          .ant-checkbox-inner {
            background-color: var(--btn-disabled);
            border-color: var(--separator-color);
          }

          & + span {
            color: var(--separator-color);
          }

          &.ant-checkbox-checked {
            .ant-checkbox-inner {
              background-color: var(--ckb-disabled);
              border-color: var(--ckb-disabled-border);
            }

            & + span {
              color: var(--ckb-disabled-font);
            }
          }
        }
      }
    }

    &:hover {
      .ant-checkbox-inner {
        border-color: var(--secondary-color);
      }
    }

    &-input {
      &:focus {
        & + .ant-checkbox-inner {
          border-color: var(--secondary-color);
        }
      }
    }

    &-disabled {
      .ant-checkbox-inner {
        background-color: var(--ckb-disabled);
      }
    }
  }

  &:hover {
    .ant-checkbox-inner {
      border-color: var(--secondary-color);
    }
  }

  .ant-checkbox {
    &:hover {
      .ant-checkbox-inner {
        border-color: var(--secondary-color);
      }
    }
  }

  .ant-checkbox-input {
    &:focus {
      & + .ant-checkbox-inner {
        border-color: var(--secondary-color);
      }
    }
  }
`;
