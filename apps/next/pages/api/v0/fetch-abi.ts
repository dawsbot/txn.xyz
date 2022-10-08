import { NextApiRequest, NextApiResponse } from 'next';
import { fetchContractABI } from './../../../src/backend/utils/fetch-contract-abi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const contractAddress = req.query.contractAddress;
  const chainID = req.query.chainID as number | undefined;
  if (typeof contractAddress !== 'string') {
    return res.status(404).send('missing required address param');
  }
  const abi = await fetchContractABI({
    contractAddress,
    chainID: chainID ?? 1,
  });
  if (Array.isArray(abi)) {
    // cache for one week
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  }

  return res.json({ abi });
}
