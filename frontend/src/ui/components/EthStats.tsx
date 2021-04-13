import React, { FC, useEffect, useState } from 'react';
import styled from '@emotion/styled';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Hooks
import { useBlocks } from 'lib/hooks/useBlocks';
import { BlockData } from '../../lib/types';

// Styled Components

const TimeSandIcon = (props: any) => {
  return (
    <svg width={46} height={65} viewBox="0 0 46 65" fill="none" {...props}>
      <path
        d="M1 1h40m4 0h-4m0 0c3.5 25.5-13.5 29.5-16.5 31M5.16 1c-4 42 38.5 22 36 62.5M1 63.5h3.5m40.5 0H4.5m0 0c-.333-4.333-.3-13.8 2.5-17"
        stroke="#E05751"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PriceIcon = (props: any) => {
  return (
    <svg className="price" width={24} height={25} viewBox="0 0 24 25" fill="none" {...props}>
      <path d="M10 19.5l5.1-5.1m1.9-1.9l-1.9 1.9m0 0c-.867.367-2.9.7-4.1-.9" stroke="#4A9ED8" strokeLinecap="round" />
      <path d="M13.5 1h10v11L11 24 1 14l8.5-8.5" stroke="#4A9ED8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2.5c-3-.5-4.5 3 0 2.5" stroke="#4A9ED8" strokeLinecap="round" />
    </svg>
  );
};

const BoxIcon = (props: any) => {
  return (
    <svg width={69} height={60} viewBox="0 0 69 60" fill="none" {...props}>
      <path
        d="M67.5 12.5L34 22m33.5-9.5V48L34 58m33.5-45.5L34 2 1 12.5M34 22v36m0-36L1 12.5M34 58L1 48V25.5m0-13V16"
        stroke="#4A9ED8"
        strokeWidth={2}
      />
    </svg>
  );
};

const EthStatsContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${BREAKPOINTS.sm}) {
    display: flex;
    flex-direction: column;
  }

  background-color: #090909;
  border-radius: 20px;
  margin-bottom: 27px;
  font-family: 'Source Sans Pro', sans-serif;

  svg {
    margin-right: 22px;

    &.price {
      margin-right: 12px;
    }
  }

  .text-info {
    color: #10a0de;
  }

  .text-success {
    color: #7bcc3a;

    path {
      stroke: #7bcc3a;
    }
  }

  .text-warning {
    color: #ffd162;

    path {
      stroke: #ffd162;
    }
  }

  .text-orange {
    color: #ff8a00;

    path {
      stroke: #ff8a00;
    }
  }

  .text-danger {
    color: #f74b4b;

    path {
      stroke: #f74b4b;
    }
  }
`;

const EthStatContainer = styled.div`
  flex: 1;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  display: flex;
`;

const EthStatTitle = styled.p`
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 12px;
`;

const EthStatValue = styled.p`
  font-weight: 300;
  font-size: 50px;
  letter-spacing: -1px;
`;

const GasLimitContainer = styled.div`
  display: flex;
  padding: 7px 15px;
  justify-content: space-between;
  grid-area: 2 / 1 / 3 / 3;

  > div {
    display: flex;
  }
`;

const GasLimitValue = styled.p`
  font-size: 16px;
  font-weight: 300;
  margin-bottom: 0;
`;

// Utils
const lastBlockTimeClass = (time: number) => {
  if (time >= 0 && time < 15) return 'text-success';
  if (time < 20) return 'text-warning';
  if (time < 25) return 'text-orange';
  return 'text-danger';
};

type EthStatsProps = {
  raffle: number;
  onBlockAction: (blocks: BlockData[]) => void;
};

const EthStats: FC<EthStatsProps> = ({ raffle, onBlockAction }) => {
  const [bestBlock, setBestBlock] = useState<any>(undefined);
  const [lastBlockTime, setLastBlockTime] = useState<number>(0);

  const { data: blocksData, refetch: refetchBlocks } = useBlocks({ raffle });

  useEffect(() => {
    if (blocksData && blocksData.length > 0) {
      const lastBlock = blocksData[0].block_number;
      if (bestBlock !== lastBlock) {
        // For real time diff, use line below, but means never starting from zero
        // const timeSinceLastBlock = moment().diff(moment(blocksData[0].timestamp * 1000), 'seconds');
        const timeSinceLastBlock = 0;
        setLastBlockTime(timeSinceLastBlock);
        setBestBlock(lastBlock);
        onBlockAction(blocksData);
      }
    }
  }, [blocksData]); //eslint-disable-line

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastBlockTime((prevLastBlockTime: number) => prevLastBlockTime + 1);
    }, 1000);

    const intervalBlocks = setInterval(refetchBlocks, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalBlocks);
    };
  }, []); //eslint-disable-line

  if (!blocksData || blocksData.length === 0) return <div />;

  return (
    <EthStatsContainer>
      <EthStatContainer>
        <BoxIcon />
        <div>
          <EthStatTitle>Best block</EthStatTitle>
          <EthStatValue className="text-info">
            #{new Intl.NumberFormat('en-US').format(blocksData[0].block_number)}
          </EthStatValue>
        </div>
      </EthStatContainer>

      <EthStatContainer>
        <TimeSandIcon className={lastBlockTimeClass(lastBlockTime)} />
        <div>
          <EthStatTitle>Last block</EthStatTitle>
          <EthStatValue className={lastBlockTimeClass(lastBlockTime)}>{lastBlockTime}s ago</EthStatValue>
        </div>
      </EthStatContainer>

      <GasLimitContainer>
        <div>
          <PriceIcon />
          <EthStatTitle>gas limit</EthStatTitle>
        </div>
        <GasLimitValue className="text-info">{blocksData[0].gas_limit} gas</GasLimitValue>
      </GasLimitContainer>
    </EthStatsContainer>
  );
};

export default EthStats;
