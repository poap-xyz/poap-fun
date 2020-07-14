import styled from '@emotion/styled';
import { Modal as ModalAntd } from 'antd';

// assets
import IconCloseModalUrl from 'assets/img/CloseModal.svg';

export const Modal = styled(ModalAntd)`
  .ant-modal {
    &-content {
      box-shadow: var(--box-shadow);
      border-radius: 6px;
    }

    &-header {
      padding: 24px;

      .ant-modal-title {
        font-family: var(--alt-font);
        color: var(--primary-color);
        font-size: 18px;
        line-height: 24px;
      }
    }

    &-body {
      padding: 24px 48px 40px;
    }

    &-footer {
      padding: 18px 24px;
    }

    &-close-x {
      .anticon {
        background: url(${IconCloseModalUrl}) no-repeat center;
        width: 100%;
        height: 100%;

        svg {
          display: none;
        }
      }
    }
  }

  &.new-modal {
    .ant-modal {
      &-header {
        border-top: 8px solid var(--badge-success);
        border-bottom: 0;
        padding: 42px 30px 0;
      }

      &-body {
        padding: 0 34px 40px;

        .description {
          color: var(--font-color);
          font-size: 12px;
          line-height: 18px;
          margin-bottom: 38px;
        }
      }
    }
  }
`;

export default Modal;
