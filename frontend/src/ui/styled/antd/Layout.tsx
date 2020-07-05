import styled from '@emotion/styled';
import { Layout as AntdLayout } from 'antd';

type LayoutProps = {
  gray?: boolean;
};

export const Layout = styled(AntdLayout)<LayoutProps>`
  background: var(--system-white);
  min-height: 100vh;
  background-color: ${({ gray }) => (gray ? 'var(--btn-disabled)' : 'transparent')};

  .ant-layout {
    &-header {
      height: auto;
      padding: 0;
      position: fixed;
      width: 100%;
      background: var(--system-white);
    }

    &-footer {
      padding: 0;
      background: var(--system-white);
    }

    &-sider {
      background: var(--system-white);
      box-shadow: var(--box-shadow);

      .logo {
        padding: 50px 35px 40px;
      }

      .ant-menu {
        border-right: 0 !important;

        &-item {
          padding-left: 48px !important;
        }

        &-item-selected {
          &::after {
            display: none !important;
          }
        }

        &-submenu-title {
          padding-left: 48px !important;
        }
      }
    }

    &-content {
      padding: 100px 24px 24px;
    }
  }
`;

export const { Header, Content } = (Layout as any).__emotion_base;
