import type { Abi } from 'viem';
import * as z from '@zod/mini';
import { supportedChainIDs } from '../../chains';

type Params = {
  contractAddress: string;
  chainID: number;
};

// Etherscan V2 is a single multichain endpoint: one API key works across all
// supported chains, with the chain selected via the `chainid` query param.
// The old per-chain V1 endpoints (api-optimistic.etherscan.io, etc.) are
// deprecated and now return an error string instead of an ABI.
// https://docs.etherscan.io/v2-migration
const ETHERSCAN_API_ROOT = 'https://api.etherscan.io/v2/api';
const apiKey = z.string().parse(process.env.ETHERSCAN_API_KEY);

export const fetchContractABI = async ({
  contractAddress,
  chainID,
}: Params): Promise<Abi> => {
  // chainID arrives from the query string as a string, so coerce before lookup.
  const numericChainID = Number(chainID);
  if (!supportedChainIDs.has(numericChainID)) {
    throw new Error(`Unsupported chainID: ${chainID}`);
  }
  const res = await fetch(
    `${ETHERSCAN_API_ROOT}?chainid=${numericChainID}&module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`,
  );
  const data: EtherscanResponse = await res.json();
  if (data.status !== '1') {
    throw new Error(
      `Etherscan API error for ${contractAddress}: ${data.result}`,
    );
  }
  // TODO: Make this a zod validation instead of a type cast
  return JSON.parse(data.result) as Abi;
};

type EtherscanResponse = {
  status: string;
  message: string;
  result: string;
};
