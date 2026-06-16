import type { Chain } from 'viem';
import {
  arbitrum,
  base,
  bsc,
  gnosis,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

/**
 * The single source of truth for every chain txn.xyz supports.
 *
 * To add a new chain, add one entry here. Everything else derives from this
 * list: the wallet config in _app.tsx, the chain dropdown on the encode page,
 * and the backend ABI fetcher's allowlist.
 *
 * `label` is the human-facing name shown in the dropdown. We keep it explicit
 * rather than reading viem's `chain.name` because a few of our preferred names
 * differ from viem's (e.g. "Binance Smart Chain" vs viem's "BNB Smart Chain").
 */
export const supportedChains = [
  { chain: mainnet, label: 'Ethereum' },
  { chain: base, label: 'Base' },
  { chain: polygon, label: 'Polygon' },
  { chain: arbitrum, label: 'Arbitrum One' },
  { chain: optimism, label: 'Optimism' },
  { chain: bsc, label: 'Binance Smart Chain' },
  { chain: gnosis, label: 'Gnosis Chain' },
] as const satisfies ReadonlyArray<{ chain: Chain; label: string }>;

/**
 * The viem chain objects, as the non-empty tuple wagmi/RainbowKit expect.
 */
export const supportedViemChains = supportedChains.map(
  ({ chain }) => chain as Chain,
) as [Chain, ...Chain[]];

/**
 * `{ value, label }` options for the encode-page chain dropdown.
 */
export const chainOptions = supportedChains.map(({ chain, label }) => ({
  value: chain.id,
  label,
}));

/**
 * Allowlist of chain IDs the backend will fetch ABIs for.
 */
export const supportedChainIDs = new Set<number>(
  supportedChains.map(({ chain }) => chain.id),
);
