import styled from '@emotion/styled';
import { Layout as AntdLayout } from 'antd';

type LayoutProps = {
  gray?: boolean;
  padded?: boolean;
};

export const Layout = styled(AntdLayout, {
  shouldForwardProp: (prop) => !['padded'].includes(prop),
})<LayoutProps>`
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
      z-index: 2;
    }

    &-footer {
      padding: 0;
      background: var(--system-white);
    }

    &-content {
      padding: ${({ padded }) => (padded ? '100px 0 24px' : '100px 0 0')};
      overflow-x: hidden;
    }
  }
`;

export const { Header, Content, Footer } = (Layout as any).__emotion_base;
