import { arbitrum, bsc, gnosis, optimism, polygon } from 'viem/chains';
import { configureChains } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, bsc, gnosis],
  [publicProvider()],
);
