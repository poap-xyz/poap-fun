import React, { FC } from 'react';
import styled from '@emotion/styled';

// Types
type StatusTagProps = {
  active: boolean;
  className?: string;
};

// Styled component
const Tag = styled.div<StatusTagProps>`
  width: 66px;
  height: 27px;
  text-align: center;
  font-family: var(--alt-font);
  font-size: 12px;
  line-height: 22px;
  padding: 2px;
  background: ${({ active }) => (active ? '#79CFBD' : '#EAEDF4')};
  color: ${({ active }) => (active ? '#FFFFFF' : '#94A0D4')};
  border-radius: 100px;
`;

const StatusTag: FC<StatusTagProps> = ({ active, className }) => {
  return (
    <Tag active={active} className={className ? className : ''}>
      {active ? 'Active' : 'Finished'}
    </Tag>
  );
};

export default StatusTag;
