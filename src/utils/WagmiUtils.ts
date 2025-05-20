import { CreateConfigParameters } from 'wagmi';

import {
  arbitrum,
  mainnet,
  polygon,
  avalanche,
  bsc,
  optimism,
  gnosis,
  zkSync,
  zora,
  base,
  celo,
  aurora,
  sepolia,
} from 'wagmi/chains';

// const bsc = {
//   id: 56,
//   name: 'BNB Smart Chain',
//   nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
//   rpcUrls: {
//     default: { http: ['https://bsc-dataseed.binance.org'] },
//     public: { http: ['https://bsc-dataseed.binance.org'] },
//   },
//   blockExplorers: {
//     default: { name: 'BscScan', url: 'https://bscscan.com' }
//   }
// }

export const chains: CreateConfigParameters['chains'] = [
  bsc,
  mainnet,
];
