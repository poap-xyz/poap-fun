import React, { FC } from 'react';
import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Helpers
import { etherscanLinks } from 'lib/helpers/etherscan';

// Types
import { BlockData } from 'lib/types';

type RaffleWinnersProps = {
  blocks?: BlockData[];
};

const Content = styled.div`
  padding: 30px 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    padding: 30px 100px;
  }

  .box {
    background: var(--system-gray);
    border-radius: 12px;
    padding: 25px;
    display: grid;
    grid-template-columns: 1fr;
    margin: auto;
    max-width: 500px;
    max-height: 300px;
    overflow-y: auto;

    @media (max-width: ${BREAKPOINTS.xs}) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    div {
      text-align: center;
      color: var(--primary-color);
      font-size: 14px;
      line-height: 24px;
      padding: 3px 0;

      a {
        color: var(--tabs-color-active);
      }
    }
  }
`;

const Title = styled.h3`
  text-align: center;
  color: var(--primary-color);
  font-family: var(--alt-font);
  font-weight: bold;
  font-size: 18px;
  padding: 20px 0;
`;

const RaffleBlocks: FC<RaffleWinnersProps> = ({ blocks }) => {
  if (!blocks || blocks?.length === 0) {
    return (
      <Content>
        <Title>No registered blocks</Title>
      </Content>
    );
  }

  return (
    <Content>
      <Title>Last Blocks used</Title>
      <div className={'box'}>
        {blocks
          .sort((a: BlockData, b: BlockData) => b.order - a.order)
          .map((block) => {
            return (
              <div key={block.id}>
                {block.order + 1}º -{' '}
                <a href={etherscanLinks.blocks(block.block_number)} target={'_blank'} rel="noopener noreferrer">
                  #{block.block_number}
                </a>{' '}
                - Gas Limit: {block.gas_limit}
              </div>
            );
          })}
      </div>
    </Content>
  );
};

export default RaffleBlocks;
