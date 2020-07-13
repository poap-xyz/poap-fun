import styled from '@emotion/styled';
import { Layout as AntdLayout } from 'antd';

type LayoutProps = {
  gray?: boolean;
  paddedContent?: boolean;
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
      z-index: 10;
    }

    &-footer {
      padding: 0 24px 24px;
      background: var(--system-white);
    }

    &-content {
      padding: ${({ paddedContent }) => (paddedContent ? '100px 0 24px' : '100px 0 0')};
    }
  }
`;

export const { Header, Content, Footer } = (Layout as any).__emotion_base;
