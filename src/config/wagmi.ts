import {
    defaultWagmiConfig,
} from '@reown/appkit-wagmi-react-native';
import Config from 'react-native-config';
import { chains } from '@/utils/WagmiUtils';
import { getMetadata } from '@/utils/misc';
import { bsc } from 'wagmi/chains';
import { http } from 'wagmi';


// 1. Get projectId
console.log(Config.ENV_PROJECT_ID);
export const projectId = Config.ENV_PROJECT_ID;

// 2. Create config
export const metadata = getMetadata();

console.log(chains);
export const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    transports: {
        [bsc.id]: http('https://bsc-dataseed.binance.org')
    },
    extraConnectors: [
        // _coinbaseConnector,
        // _authConnector
    ],
});
