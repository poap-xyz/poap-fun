import styled from '@emotion/styled';
import { Select as SelectAntd } from 'antd';

// assets
import IconCloseUrl from 'assets/img/CrossTab.svg';

export const Select = styled(SelectAntd)`
  .ant-select-selector {
    border-radius: 4px !important;
    border-color: var(--separator-color) !important;

    &:hover {
      border-color: var(--secondary-color) !important;
    }

    .ant-select-selection-item {
      color: var(--font-color) !important;
      font-size: 14px !important;
      height: 32px !important;
      line-height: 32px !important;

      .content {
        img {
          width: 26px;
          height: 26px;
          border-radius: 26px;
          margin: 0;
        }
        &.event-data {
          padding: 2px 0 0 10px;
          .extra-data {
            display: none;
          }
        }
      }
    }
  }

  .ant-select-selection-placeholder {
    color: var(--system-placeholder);
    opacity: 1;
  }

  .ant-select-arrow {
    color: var(--font-color);
  }

  &.ant-select-focused {
    border-color: var(--secondary-color) !important;

    &.ant-select-single {
      &:not(.ant-select-customize-input) {
        .ant-select-selector {
          box-shadow: none !important;
        }
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

  &.ant-select {
    &-multiple {
      .ant-select-selector {
        box-shadow: none !important;
      }

      &.ant-input-focused {
        border-color: var(--secondary-color) !important;
        box-shadow: none !important;
        outline: none !important;
      }

      .ant-select {
        &-selector {
          padding: 1px 6px;
        }

        &-selection-item {
          background: var(--light-violet);
          color: var(--dark-secondary-color);
          font-size: 12px;
          border-radius: 4px;
          border: 0;
          height: 24px;
          line-height: 24px;
          padding-right: 9px;
          margin-right: 8px;

          &-content {
            margin-right: 9px;
          }
        }

        &-selection-item-remove {
          color: var(--dark-secondary-color);
          background: url(${IconCloseUrl}) no-repeat center;
          width: 6px;

          svg {
            display: none;
          }
        }
      }
    }
  }
`;

export const { Option } = (Select as any).__emotion_base;
