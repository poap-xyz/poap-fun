import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Helpers
import { etherscanLinks } from 'lib/helpers/etherscan';

// Types
import { ResultsTable, Prize } from 'lib/types';

type RaffleWinnersProps = {
  isLoading: boolean;
  winners?: ResultsTable;
  prizes: Prize[];
  accountAddress: string;
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

const WinnerText = styled.span`
  font-weight: ${({ isWinner }: { isWinner?: boolean }) => (isWinner ? 700 : 400)};
`;

const PrizeInfo = styled.div`
  color: var(--secondary-color);
  border-bottom: 1px dotted var(--border-color);
`;

const BigNumber = styled.span`
  font-size: 28px;
  line-height: 32px;
`;

// Utils
const shortAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const RaffleWinners: FC<RaffleWinnersProps> = ({ winners, isLoading, accountAddress, prizes }) => {
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
        <Title>Leaderboard</Title>
        <div className={'participant-box'}>
          {winners?.entries
            ?.sort((b: any, a: any) => b.order - a.order)
            ?.map(({ id, order, participant }: any) => {
              let prize = prizes.find((prize) => prize.order === order + 1);
              return (
                <div key={id}>
                  <WinnerText isWinner={participant.address === accountAddress}>
                    {prize ? <BigNumber>{order + 1}º</BigNumber> : <>{order + 1}º</>} - POAP{' '}
                    <a href={etherscanLinks.poap(participant.poap_id)} target={'_blank'} rel="noopener noreferrer">
                      #{participant.poap_id.toString().padStart(5, '0')}
                    </a>{' '}
                    -{' '}
                    <a href={etherscanLinks.address(participant.address)} target={'_blank'} rel="noopener noreferrer">
                      {participant.ens_name ? participant.ens_name : shortAddress(participant.address)}
                    </a>
                    {prize && <PrizeInfo>🎖{prize.name}</PrizeInfo>}
                  </WinnerText>
                </div>
              );
            })}
        </div>
      </Content>
    </Spin>
  );
};

export default RaffleWinners;
