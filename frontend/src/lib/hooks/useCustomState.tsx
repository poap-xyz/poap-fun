import { useState, useEffect } from 'react';
import constate from 'constate';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';

// Hooks
import { usePoaps } from 'lib/hooks/usePoaps';

// Helpers
import { safeGetItem } from 'lib/helpers/localStorage';

// Types
import { Raffle } from 'lib/types';
type RaffleDictionary = {
  [id: number]: Raffle;
};

const useCustomState = () => {
  let raffleIds = safeGetItem('raffles-created');
  let raffles: RaffleDictionary = {};
  if (raffleIds && Array.isArray(raffleIds)) {
    for (let id of raffleIds) {
      let raffle = safeGetItem(`raffle-${id}`) as Raffle;
      if (raffle) {
        raffles[raffle.id] = raffle;
      }
    }
  }

  // State
  const [rafflesInfo, setRafflesInfo] = useState<RaffleDictionary>(raffles);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { data: poaps, isLoading: isFetchingPoaps } = usePoaps({ account });

  // Functions
  const saveRaffle = (raffle: Raffle) => {
    setRafflesInfo({ ...rafflesInfo, [raffle.id]: raffle });
  };
  const connectWallet = async () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_KEY,
        },
      },
    };

    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
      providerOptions,
    });

    try {
      const provider = await web3Modal.connect();
      const _web3: Web3 = new Web3(provider);
      setWeb3(_web3);
      setIsConnected(true);

      // TODO - review why _web3.eth.getAccounts() is not working
      if (provider.selectedAddress) setAccount(provider.selectedAddress);
      if (provider.accounts) setAccount(provider.accounts[0]);
    } catch (e) {
      console.log('Error > Connecting wallet');
      console.log(e);
    }
  };
  const disconnectWallet = () => {
    setWeb3(null);
    setIsConnected(false);
    setAccount('');
  };

  return {
    rafflesInfo,
    saveRaffle,
    web3,
    connectWallet,
    disconnectWallet,
    isConnected,
    account,
    poaps,
    isFetchingPoaps,
  };
};

const [StateProvider, useStateContext] = constate(useCustomState);

export { StateProvider, useStateContext };
