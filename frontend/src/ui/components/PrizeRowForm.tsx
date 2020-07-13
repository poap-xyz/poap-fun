import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FiTrash } from 'react-icons/fi';

// Types
type PrizeRowFormProps = {
  order: number;
  prize: string;
  deleteAction?: () => void;
};

// Styled component
const PrizeHolder = styled.div`
  width: 100%;
  background: var(--system-gray);
  border-radius: 5px;
  padding: 5px 10px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  .prize {
    font-size: 14px;
    span {
      font-weight: bold;
      font-size: 16px;
      padding-right: 5px;
    }
  }
  .action {
    cursor: pointer;
    padding-top: 3px;
    svg {
      transform: scale(1.3);
    }
  }
`;

const PrizeRowForm: FC<PrizeRowFormProps> = ({ order, prize, deleteAction }) => {
  return (
    <PrizeHolder>
      <div className={'prize'}>
        <span>{order}º</span>
        {prize}
      </div>
      <div className={'action'}>{deleteAction && <FiTrash onClick={deleteAction} />}</div>
    </PrizeHolder>
  );
};

export default PrizeRowForm;
