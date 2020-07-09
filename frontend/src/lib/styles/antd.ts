import { css } from '@emotion/core';
import IconErrorUrl from 'assets/img/Error.svg';
import IconInfoUrl from 'assets/img/Info.svg';
import IconSuccessUrl from 'assets/img/Check.svg';
import IconWarningUrl from 'assets/img/Warning.svg';

export const antdStyles = css`
  /* Select Dropdown */

  .ant-select-dropdown {
    box-shadow: var(--box-shadow) !important;
    border-radius: 4px !important;
    .ant-select-item {
      color: var(--font-color) !important;
    }
  }
  .ant-select-item-option-selected {
    &:not(.ant-select-item-option-disabled) {
      color: var(--secondary-color) !important;
      font-weight: 500 !important;
      background-color: var(--system-white) !important;
    }
  }

  .ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state {
    color: var(--secondary-color);
  }

  /* Tooltip */
  .ant-tooltip {
    &-inner {
      background-color: var(--label-input);
    }
  }

  /* Textarea */

  textarea.ant-input {
    /*max-width: 436px;*/
    border-radius: 4px;
    padding: 0.5rem 1rem 1rem;
    &::placeholder {
      color: var(--font-color);
    }
    &:hover,
    &:focus {
      border-color: var(--secondary-color);
      box-shadow: none;
    }
    & + small {
      color: var(--font-color);
      text-align: right;
      line-height: 16px;
      display: block;
    }
  }

  /* Input Search */
  .ant-input-search {
    border-color: var(--separator-color);
    color: var(--success-font-color);
    border-radius: 4px;
    .ant-input {
      &-prefix {
        display: flex;
        align-items: center;
        margin-right: 9px;
        svg {
          stroke: var(--font-color);
        }
      }
      &-suffix {
        display: none;
      }
    }
    input {
      color: var(--input-color);
      &::placeholder {
        color: var(--system-placeholder) !important;
        opacity: 1;
      }
    }
    &:hover,
    &:focus,
    &.ant-input-focused {
      border-color: var(--secondary-color);
      box-shadow: none;
    }
    &.ant-input-affix-wrapper-focused {
      border-color: var(--secondary-color);
      box-shadow: none;
    }
    &.ant-input-affix-wrapper-disabled {
      color: var(--font-color);
      background-color: var(--btn-disabled);
      &:hover {
        border-color: var(--separator-color);
      }
    }
    .ant-input-group {
      &-addon {
        font-family: var(--alt-font);
        color: var(--label-input);
        font-weight: 500;
        background-color: transparent;
        border: 0;
        padding-bottom: 4px;
        padding-left: 0;
        button {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
      }
      .ant-input {
        border-radius: 4px !important;
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
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
    }
  }
  .ant-input-group {
    .ant-input-affix-wrapper {
      &:not(:first-of-type) {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }
  }

  /* Input Password */
  .ant-input-password {
    .ant-input-group {
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
          color: var(--font-color) !important;
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
  }

  /* Message */
  .ant-message {
    font-family: var(--alt-font);
    font-size: 12px;

    .ant-message-notice {
      padding: 0;
      margin: 8px 0 16px;
    }

    .ant-message-notice-content {
      padding: 0;
    }

    .ant-message-custom-content {
      display: flex;
      align-items: center;
      height: 40px;
      border-radius: 4px;

      padding: 0 16px;

      svg {
        margin-right: 8px;
      }
    }

    .ant-message-info {
      border: 1px solid transparent !important;
      background-color: var(--info-color) !important;
      color: rgba(3, 8, 82, 0.65) !important;

      .ant-message-icon {
        background: url(${IconInfoUrl}) no-repeat;
      }
    }
    .ant-message-success {
      border: 1px solid transparent !important;
      background-color: var(--success-color) !important;
      color: var(--success-font-color) !important;

      .ant-message-icon {
        background: url(${IconSuccessUrl}) no-repeat;
      }
    }
    .ant-message-warning {
      border: 1px solid var(--warning-border) !important;
      background-color: var(--warning-color) !important;
      color: rgba(3, 8, 82, 0.65) !important;

      .ant-message-icon {
        background: url(${IconWarningUrl}) no-repeat;
      }
    }
    .ant-message-error {
      border: 1px solid var(--error-border) !important;
      background-color: var(--error-color) !important;
      color: rgba(3, 8, 82, 0.65) !important;

      .ant-message-icon {
        background: url(${IconErrorUrl}) no-repeat;
      }
    }
  }

  /* DatePicker */
  .ant-picker {
    &-range {
      width: 342px !important;
    }
    &-dropdown {
      border-color: var(--border-picker);
      border-radius: 4px;
    }
    &-header {
      background-color: var(--secondary-color);
      border-radius: 4px 4px 0 0;
      .ant-picker-month-btn {
        text-transform: capitalize;
      }
    }
    &-header-view,
    &-header button {
      color: var(--system-white);
      font-family: var(--alt-font);
    }
    &-header button {
      &:hover {
        color: var(--calendar-btn-hover);
      }
    }
    &-prev-icon,
    &-next-icon,
    &-super-prev-icon,
    &-super-next-icon {
      &::before {
        border-width: 1px 0 0 1px;
      }
    }
    &-super-prev-icon,
    &-super-next-icon {
      &::after {
        border-width: 1px 0 0 1px;
      }
    }
    &-date-panel {
      .ant-picker-body {
        padding: 12px;
      }
    }
    &-content {
      font-size: 14px;
      margin: 0;
      th {
        font-family: var(--alt-font);
        color: var(--calendar-color);
        height: auto;
        padding: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        text-align: center;
        border: 0;
      }
    }
    &-cell {
      color: var(--calendar-color-light);
      text-align: center;
      border: 0;
    }
    &-cell-in-view {
      color: var(--calendar-color);
      &.ant-picker-cell-today {
        color: var(--secondary-color);
        .ant-picker-cell-inner {
          background-color: var(--calendar-primary-light);
          &::before {
            border-color: transparent;
          }
        }
      }
      &.ant-picker-cell-selected {
        .ant-picker-cell-inner {
          background: var(--secondary-color);
        }
      }
    }
    &-today-btn {
      font-family: var(--alt-font);
      color: var(--secondary-color);
      font-weight: 500;
      letter-spacing: 0.4px;
      &:hover {
        color: var(--primary-color);
      }
    }
    &-week-panel-row-selected td,
    &-week-panel-row-selected:hover td {
      background: var(--secondary-color);
    }
  }

  /* TimePicker */
  .ant-picker-time-panel {
    &-column {
      & > li.ant-picker-time-panel-cell-selected {
        .ant-picker-time-panel-cell-inner {
          color: var(--calendar-color);
          background: var(--calendar-primary-light);
          font-weight: 500;
        }
      }
      &:not(:first-of-type) {
        border-left: 1px solid var(--calendar-color-light);
      }
    }
  }
  .ant-picker-dropdown {
    .ant-btn-primary {
      background-color: var(--secondary-color) !important;
      border-color: var(--secondary-color) !important;
      &[disabled] {
        color: rgba(0, 0, 0, 0.25) !important;
        background-color: #f5f5f5 !important;
        border-color: #d9d9d9 !important;
      }
    }
    .ant-picker-footer {
      a {
        font-weight: 500 !important;
        color: var(--secondary-color) !important;
        &:hover {
          color: var(--primary-color) !important;
        }
      }
    }
  }

  /* Modal */
  .ant-modal {
    &-title {
      color: var(--primary-color);
      font-size: 18px;
      font-weight: 400;
    }

    &-content {
      border-radius: 6px !important;
    }

    &-confirm-body {
      svg {
        display: inline-block;
        vertical-align: middle;
        & + .ant-modal-confirm-title {
          font-family: var(--alt-font);
          color: var(--label-input);
          margin-left: 16px;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .ant-modal-confirm-content {
        color: var(--picker-color);
        font-size: 12px;
        line-height: 18px;
        padding-left: 34px;
      }
    }
    &-confirm-btns {
      .ant-btn {
        font-family: var(--alt-font);
        border-color: var(--secondary-color);
        color: var(--secondary-color);
        border-radius: 4px;
        &-primary {
          color: var(--system-white);
          background-color: var(--secondary-color);
        }
      }
    }
  }

  /* Notification */
  .ant-notification {
    .ant-notification {
      &-notice {
        background: var(--secondary-color);
        color: var(--system-white);
        box-shadow: var(--box-shadow);
        border-radius: 4px;
        padding: 18px 23px;
        &-message {
          font-family: var(--alt-font);
          display: inline-block;
          margin-bottom: 10px;
          color: var(--system-white);
          font-size: 18px;
          line-height: 26px;
        }
        &-description {
          color: var(--light-violet);
          font-size: 12px;
          line-height: 18px;
          max-width: 300px;
        }
        &-close {
          top: 18px;
          color: var(--system-white);
          font-size: 17px;
        }
      }
    }
  }
`;
