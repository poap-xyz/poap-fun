import { useState, useEffect } from 'react';
import constate from 'constate';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import { message } from 'antd';
// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider';
import { SmartWalletUtils } from '@argent/smartwallet-utils';

// Hooks
import { usePoaps } from 'lib/hooks/usePoaps';

// Helpers
import { safeGetItem } from 'lib/helpers/localStorage';

// Types
import { Raffle } from 'lib/types';
type RaffleDictionary = {
  [id: number]: Raffle;
};
type RPCResponse = {
  id: number;
  result: string;
  jsonrpc: string;
};

const useCustomState = () => {
  // Local storage
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

  let _token = localStorage.getItem('fcm-token');

  const requiredNetworkId = 1;

  // Web3Modal
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
    cacheProvider: true,
    providerOptions,
  });

  // State
  const [rafflesInfo, setRafflesInfo] = useState<RaffleDictionary>(raffles);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<number>(0);
  const [provider, setProvider] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [token, setToken] = useState<string>(_token ? _token : '');

  const { data: poaps, isLoading: isFetchingPoaps } = usePoaps({ account });

  // Effects
  useEffect(() => {
    if (!isConnected && web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [isConnected]); //eslint-disable-line
  useEffect(() => {
    const intervalNetwork = setInterval(function () {
      if (web3) {
        web3.eth.net.getId((err, currentNet) => {
          // No error and change in network
          if (!err && network > 0 && currentNet !== network) {
            if (currentNet === requiredNetworkId) {
              window.location.reload();
            } else if (network === requiredNetworkId) {
              showNetworkErrorMessage();
            }
            setNetwork(currentNet);
          }
        });
      }
    }, 1000);

    return () => {
      clearInterval(intervalNetwork);
    };
  }, [network]); //eslint-disable-line

  // Functions
  const saveRaffle = (raffle: Raffle) => {
    setRafflesInfo({ ...rafflesInfo, [raffle.id]: raffle });
  };
  const connectWallet = async () => {
    try {
      const _provider = await web3Modal.connect();
      const _web3: Web3 = new Web3(_provider);
      setWeb3(_web3);
      setIsConnected(true);
      setProvider(_provider);

      // TODO - review why _web3.eth.getAccounts() is not working
      let _account = '';
      if (_provider && _provider.selectedAddress) {
        _account = _provider.selectedAddress;
        setAccount(_account);
      }
      if (!_account && _provider && _provider.accounts) {
        _account = _provider.accounts[0];
        setAccount(_account);
      }
      if (!account && _provider && _provider.address) {
        _account = _provider.address;
        setAccount(_account);
      }

      let netId = await _web3.eth.net.getId();
      setNetwork(netId);
      if (requiredNetworkId !== netId) showNetworkErrorMessage();
    } catch (e) {
      console.log('Error > Connecting wallet');
      console.log(e);
    }
  };
  const disconnectWallet = () => {
    try {
      // @ts-ignore
      web3?.currentProvider.close();
    } catch (e) {}
    web3Modal.clearCachedProvider();
    setWeb3(null);
    setIsConnected(false);
    setAccount('');
  };

  // EIP712 signature
  const web3Send = (params: any): Promise<RPCResponse | null> =>
    new Promise((resolve, reject) => {
      if (web3?.currentProvider && typeof web3.currentProvider !== 'string' && web3.currentProvider.send) {
        web3.currentProvider.send(params, (err: any, res: any) => {
          if (err) {
            return reject(err);
          }
          return resolve(res as RPCResponse);
        });
      }
    });

  const signMessage = async (raffle: Raffle): Promise<string[]> => {
    if (!account || !web3 || !provider || !account) return ['', ''];

    const domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'salt', type: 'bytes32' },
    ];
    const participant = [
      { name: 'wallet', type: 'address' },
      { name: 'raffle', type: 'uint256' },
    ];

    const domainData = {
      name: 'POAP.fun',
      version: '1',
      chainId: requiredNetworkId,
      salt: process.env.REACT_APP_SIGNATURE_SALT,
    };
    const message = {
      wallet: account,
      raffle: raffle.id,
    };

    const data = JSON.stringify({
      types: {
        EIP712Domain: domain,
        Participant: participant,
      },
      domain: domainData,
      primaryType: 'Participant',
      message: message,
    });

    // Check if account is Smart Contract Wallet
    const swu = new SmartWalletUtils(provider, account);
    const walletHelper = await swu.getWalletHelper();
    if (walletHelper.getName() !== 'EOA') {
      return [walletHelper.getName(), data];
    }

    try {
      const result = await web3Send({
        method: 'eth_signTypedData_v4',
        params: [account, data],
        from: account,
        id: 1,
      });
      return [result && result.result ? result.result : '', data];
    } catch (e) {
      console.log('Error >> EIP712 signature');
      console.log(e);
      if (e.message.toLowerCase().indexOf('not supported on this device') > -1) {
        return [`unsupported-signature-${localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')}`, data];
      }
      if (e.message.toLowerCase().indexOf('eth_signtypeddata') > -1) {
        return [`unsupported-signature-${localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER')}`, data];
      }
    }
    return ['', ''];
  };

  // FCM notifications
  const saveToken = (_token: string) => {
    if (_token !== '') {
      setToken(_token);
      localStorage.setItem('fcm-token', _token);
    }
  };

  // Network monitoring
  const showNetworkErrorMessage = () => {
    message.error('Please, switch to the Ethereum main network to join raffles!', 0);
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
    signMessage,
    token,
    saveToken,
  };
};

const [StateProvider, useStateContext] = constate(useCustomState);

export { StateProvider, useStateContext };
