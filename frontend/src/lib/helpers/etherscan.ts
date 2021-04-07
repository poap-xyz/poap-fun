const ETHERSCAN_URL = 'https://etherscan.io';
const POAP_CONTRACT = process.env.REACT_APP_POAP_CONTRACT;

export const etherscanLinks = {
  address: (address: string | number) => `${ETHERSCAN_URL}/address/${address}`,
  blocks: (address: string | number) => `${ETHERSCAN_URL}/block/${address}`,
  poap: (id: string | number) => `${ETHERSCAN_URL}/token/${POAP_CONTRACT}?a=${id}#inventory`,
  addressPoapInventory: (address: string) => `${ETHERSCAN_URL}/token/${POAP_CONTRACT}?a=${address}#inventory`,
};
