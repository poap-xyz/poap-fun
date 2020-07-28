const ETHERSCAN_URL = 'https://etherscan.io';

export const etherscanLinks = {
  address: (address) => `${ETHERSCAN_URL}/address/${address}`,
  blocks: (address) => `${ETHERSCAN_URL}/blocks/${address}`,
  poap: (id) => `${ETHERSCAN_URL}/token/0x22c1f6050e56d2876009903609a2cc3fef83b415?a=${id}`,
};
