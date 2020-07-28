const ETHERSCAN_URL = 'https://etherscan.io';
const POAP_CONTRACT = process.env.REACT_APP_POAP_CONTRACT;

export const etherscanLinks = {
  address: (address: string) => `${ETHERSCAN_URL}/address/${address}`,
  blocks: (address: string) => `${ETHERSCAN_URL}/blocks/${address}`,
  poap: (id: string) => `${ETHERSCAN_URL}/token/${POAP_CONTRACT}?a=${id}`,
};
