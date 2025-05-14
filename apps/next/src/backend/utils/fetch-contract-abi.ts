import type { Abi } from 'viem';
import { parse, string } from 'valibot';

type Params = {
  contractAddress: string;
  chainID: number;
};
const chainData: Record<number, { apiRoot: string; apiKey: string }> = {
  1: {
    apiRoot: 'https://api.etherscan.io/api',
    apiKey: parse(string(), process.env.ETHERSCAN_API_KEY),
  },
  10: {
    apiRoot: 'https://api-optimistic.etherscan.io/api',
    apiKey: parse(string(), process.env.OPTIMISTIC_ETHERSCAN_API_KEY),
  },
  56: {
    apiRoot: 'https://api.bscscan.com/api',
    apiKey: parse(string(), process.env.BSCSCAN_API_KEY),
  },
  100: {
    apiRoot: 'https://api.gnosisscan.io/api',
    apiKey: parse(string(), process.env.GNOSISSCAN_API_KEY),
  },
  137: {
    apiRoot: 'https://api.polygonscan.com/api',
    apiKey: parse(string(), process.env.POLYGONSCAN_API_KEY),
  },
  42161: {
    apiRoot: 'https://api.arbiscan.io/api',
    apiKey: parse(string(), process.env.ARBISCAN_API_KEY),
  },
  8453: {
    apiRoot: 'https://api.basescan.org/api',
    apiKey: parse(string(), process.env.BASESCAN_API_KEY),
  },
};

export const fetchContractABI = async ({
  contractAddress,
  chainID,
}: Params): Promise<Abi> => {
  const selectedChainData = chainData[chainID];
  const { apiRoot, apiKey } = selectedChainData;
  const abi = fetch(
    `${apiRoot}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`,
  )
    .then((res) => res.json())
    .then((data: EtherscanResponse) => {
      // TODO: Make this a valibot validation instead of a type cast
      return JSON.parse(data.result) as Abi;
    });
  return abi;
};

type EtherscanResponse = {
  status: '1';
  message: 'OK';
  result: '[{"inputs":[{"internalType":"address","name":"token_","type":"address"},{"internalType":"bytes32","name":"merkleRoot_","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"index","type":"uint256"},{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32[]","name":"merkleProof","type":"bytes32[]"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"isClaimed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"merkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]';
};
