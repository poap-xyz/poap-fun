import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
import { ResultsTable } from 'lib/types';

type RaffleWinnersProps = {
  isLoading: boolean;
  winners?: ResultsTable;
};

const Content = styled.div`
  padding: 30px 0;

  @media (min-width: ${BREAKPOINTS.sm}) {
    padding: 30px 100px;
  }

  .participant-box {
    background: var(--system-gray);
    border-radius: 12px;
    padding: 25px;
    display: grid;
    grid-template-columns: 1fr;
    margin: auto;
    max-width: 500px;

    @media (max-width: ${BREAKPOINTS.xs}) {
      grid-template-columns: 1fr 1fr 1fr;
    }

    div {
      text-align: center;
      color: var(--primary-color);
      font-size: 14px;
      line-height: 24px;
      padding: 3px 0;
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

// Utils
const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const RaffleWinners: FC<RaffleWinnersProps> = ({ winners, isLoading }) => {
  if (!winners || winners?.entries?.length === 0) {
    return (
      <Content>
        <Title>No registered winners</Title>
      </Content>
    );
  }

  return (
    <Spin spinning={isLoading} tip="Loading winners">
      <Content>
        <Title>Winners result's table</Title>
        <div className={'participant-box'}>
          {winners?.entries
            ?.sort((b: any, a: any) => b.order - a.order)
            ?.map(({ id, order, participant }: any) => {
              return (
                <div key={id}>
                  <span>
                    {order + 1}º - #{participant.poap_id.padStart(5, '0')} - {shortAddress(participant.address)}
                  </span>
                </div>
              );
            })}
        </div>
      </Content>
    </Spin>
  );
};

export default RaffleWinners;
