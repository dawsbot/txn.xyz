import { ContractInterface } from 'ethers';

type Params = {
  contractAddress: string;
  chainID: number;
};
const chainData: Record<number, { apiRoot: string; apiKey: string }> = {
  1: {
    apiRoot: 'https://api.etherscan.io/api', // Ethereum mainnet
    // TODO: Replace this with definitive env checking
    apiKey: process.env.ETHERSCAN_API_KEY as string,
  },
  10: {
    apiRoot: 'https://api-optimistic.etherscan.io/api',
    apiKey: process.env.OPTIMISTIC_ETHERSCAN_API_KEY as string,
  },
  100: {
    apiRoot: 'https://api.gnosisscan.io/api',
    apiKey: process.env.GNOSISSCAN_API_KEY as string,
  },
  137: {
    apiRoot: 'https://api.polygonscan.com/api', // Polygon
    apiKey: process.env.POLYGONSCAN_API_KEY as string,
  },
};

export const fetchContractABI = async ({
  contractAddress,
  chainID,
}: Params): Promise<ContractInterface> => {
  const selectedChainData = chainData[chainID];
  const { apiRoot, apiKey } = selectedChainData;
  const abi = fetch(
    `${apiRoot}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`,
  )
    .then((res) => res.json())
    .then((data: EtherscanResponse) => {
      return JSON.parse(data.result) as ContractInterface;
    });
  return abi;
};

type EtherscanResponse = {
  status: '1';
  message: 'OK';
  result: '[{"inputs":[{"internalType":"address","name":"token_","type":"address"},{"internalType":"bytes32","name":"merkleRoot_","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"isClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]';
};
