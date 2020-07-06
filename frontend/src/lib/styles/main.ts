import { css } from '@emotion/core';

export const mainStyles = css`
  :root {
    /* fonts */
    --main-font: 'Archivo', sans-serif;
    --alt-font: 'Archivo Narrow', sans-serif;

    /* brand */
    --primary-color: #6534ff;
    --secondary-color: #94a0d4;
    --tertiary-color: #e98d9b;
    --dark-secondary-color: #4144d9;
    --light-violet: #f2f0ff;

    /* badge */
    --badge-color: #ff7675;
    --badge-default: rgba(0, 0, 0, 0.25);
    --badge-error: #ff4d4f;
    --badge-success: #5cdbd3;

    /* system */
    --system-white: #ffffff;
    --system-black: #000000;
    --system-gray: #eaedf4;
    --system-light-gray: #eaedf4;
    --font-color: #8297ad;
    --separator-color: #e4ecf2;
    --btn-disabled: #f3f5f9;
    --label-input: #131d66;
    --picker-color: #5e768f;
    --input-color: #5e768f;
    --border-color: #b1becc;

    /* message */
    --msg-success: #0fab87;
    --msg-warning: #d9b85f;

    /* tags */
    --tag-violet: var(--light-violet);
    --tag-violet-color: var(--dark-secondary-color);
    --tag-green: var(--success-color);
    --tag-green-color: var(--msg-success);
    --tag-red: var(--error-color);
    --tag-red-color: #d9595d;
    --tag-gold: #fffdf0;
    --tag-gold-color: var(--msg-warning);

    /* tabs */
    --tabs-color-active: #433fe7;
    --tabs-color: var(--step-wait);
    --tabs-border: #dddddd;

    /* calendar */
    --calendar-color: rgba(3, 8, 82, 0.65);
    --calendar-color-light: rgba(3, 8, 82, 0.15);
    --calendar-primary-light: rgba(204, 204, 255, 0.403273);
    --calendar-btn-hover: #d0d0d0;

    /* checkbox */
    --ckb-disabled: #f5f5f5;
    --ckb-disabled-border: #d9d9d9;
    --ckb-disabled-font: #bfbfbf;

    /* progress */
    --progress-success: #ccccff;

    /* menu */
    --menu-item-bkg: #f8f7ff;

    /* alerts */
    --success-color: #ddfff2;
    --success-icon-color: #52c41a;
    --success-font-color: #626e80;
    --info-color: #ebebff;
    --warning-color: #fdf6de;
    --warning-border: #ffe07e;
    --warning-icon: #faad14;
    --error-color: #fff1f0;
    --error-border: #ff7675;
    --error-icon: #f5222d;

    /* picker */
    --border-picker: #e8ebf0;

    /* Steps */
    --step-wait: rgba(3, 8, 82, 0.25);

    /* Table*/
    --table-selector: #f8f7ff;

    /* elevation */
    --elevation-1: 0px 10px 30px 0px rgba(55, 136, 176, 0.2);

    /* Schedule */
    --schedule-primary: var(--badge-success);
    --schedule-secondary: #b5f5ec;
    --schedule-font: #43b5b1;
    --schedule-border: #21bcaf;
    --schedule-border-list: #f0f0f0;

    /* Card: colors */
    --card-color1: var(--badge-success);
    --card-color2: var(--schedule-secondary);
    --card-color3: var(--schedule-font);
    --card-color4: #2e8f8f;

    /* BoxShadow */
    --box-shadow: 0px 0px 16px rgba(130, 151, 173, 0.16);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    /* TODO: Improvement: replace font family from antd using less plugin */
    font-family: var(--main-font) !important;
    color: var(--font-color);
    font-size: 14px;
    line-height: 24px;
  }

  ::selection {
    background-color: var(--secondary-color);
    color: var(--system-white);
  }

  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--main-font);
    color: var(--primary-color);
  }

  h1 {
    font-weight: 600;
    font-size: 40px;
    line-height: 44px;
  }
  h2 {
    font-weight: normal;
    font-size: 24px;
    line-height: 26px;
  }

  h3 {
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
  }

  h4 {
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  h5 {
    color: var(--label-input);
    font-weight: 500;
    font-size: 18px;
    line-height: 26px;
  }

  h6 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 24px;
  }

  a {
    text-decoration: unset;
    color: var(--primary-color);
  }

  a:hover {
    color: var(--secondary-color);
  }

  button:active {
    outline: none;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
    font-size: 16px;
  }

  input:-internal-autofill-selected {
    background-color: var(--system-white) !important;
    background-image: none !important;
    color: -internal-light-dark-color(black, white) !important;
  }

  input[type='password' i] {
    -webkit-text-security: disc !important;
  }

  input:focus {
    background-color: var(--system-white) !important;
  }

  input:hover {
    background-color: var(--system-white) !important;
  }

  /* utilitary classes */
  .mb-0 {
    margin-bottom: 0;
  }

  .mb-1 {
    margin-bottom: 48px;
  }

  .mb-2 {
    margin-bottom: 24px;
  }

  .mb-3 {
    margin-bottom: 16px;
  }

  .mb-4 {
    margin-bottom: 8px;
  }

  .mb-5 {
    margin-bottom: 4px;
  }

  .justify-flex-end {
    display: flex;
    justify-content: flex-end;
  }
`;
