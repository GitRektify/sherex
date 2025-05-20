import '@walletconnect/react-native-compat';
import React, {useEffect} from 'react';
import {Linking} from 'react-native';
// import BootSplash from 'react-native-bootsplash';
import {createAppKit, AppKit} from '@reown/appkit-wagmi-react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// import {coinbaseConnector} from '@reown/appkit-coinbase-wagmi-react-native';
// import {authConnector} from '@reown/appkit-auth-wagmi-react-native';
import {WagmiProvider} from 'wagmi';
// import {handleResponse} from '@coinbase/wallet-mobile-sdk';
import Toast from 'react-native-toast-message';
import Config from 'react-native-config';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Sentry from '@sentry/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {getCustomWallets} from '@/utils/misc';
import Root from '@/navigators/router';
import {siweConfig} from '@/utils/SiweUtils';
import {chains} from '@/utils/WagmiUtils';
import {Provider} from 'react-redux';
import {I18nextProvider} from 'react-i18next';
import SettingsStore from '@/stores/SettingsStore';
import store from '@/stores/index';
import i18n from '@/utils/i18n/i18n';
import {StatisticsProvider} from '@/providers/StaticProvider';
import {wagmiConfig, projectId, metadata} from './config/wagmi';

Sentry.init({
  enabled: !__DEV__ && !!Config.ENV_SENTRY_DSN,
  dsn: Config.ENV_SENTRY_DSN,
  environment: Config.ENV_SENTRY_TAG,
  _experiments: {
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  },
  tracesSampleRate: 0.5,
  profilesSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

const clipboardClient = {
  setString: async (value: string) => {
    Clipboard.setString(value);
  },
};

// Removed coinbase connector for now, as it's not compatible with React Native New Architecture
// const _coinbaseConnector = coinbaseConnector({
//   redirect: metadata?.redirect?.universal || '',
// });

// const _authConnector = authConnector({
//   projectId,
//   metadata,
// });

const customWallets = getCustomWallets();

// 3. Create modal
createAppKit({
  projectId,
  wagmiConfig,
  metadata,
  siweConfig,
  clipboardClient,
  customWallets,
  connectorImages: {
    coinbaseWallet:
      'https://play-lh.googleusercontent.com/wrgUujbq5kbn4Wd4tzyhQnxOXkjiGqq39N4zBvCHmxpIiKcZw_Pb065KTWWlnoejsg',
    appKitAuth: 'https://avatars.githubusercontent.com/u/179229932',
  },
  features: {
    email: true,
    socials: ['x', 'discord', 'apple'],
    emailShowWallets: true,
    swaps: true,
  },
  themeMode: "dark",
  // themeVariables: {
  //   "--w3m--accent": "#ffffff",
  //   "--w3m-color-mix": "#00BB7F",
  //   "--w3m-color-mix-strength": 40,
  // },
});

const queryClient = new QueryClient();

function App(): JSX.Element {
  useEffect(() => {
    // Hide splashscreen
    // BootSplash.hide({fade: true});

    // Check if app was opened from a link-mode response
    async function checkInitialUrl() {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        SettingsStore.setCurrentRequestLinkMode(initialUrl.includes('wc_ev'));
      }
    }

    checkInitialUrl();
  }, []);

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={{flex: 1}}>
          <NavigationContainer>
            <WagmiProvider config={wagmiConfig}>
              <QueryClientProvider client={queryClient}>
                <StatisticsProvider>
                  <Root />
                  <Toast />
                  <AppKit />
                </StatisticsProvider>
              </QueryClientProvider>
            </WagmiProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </I18nextProvider>
    </Provider>
  );
}

export default Sentry.wrap(App);

/*
import React from "react";
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";

import "../src1/global";
import Root from "../src1/navigations/router";
import { StatisticsProvider } from "../src1/static_provider";
import i18n from '../src1/utils/i18n/i18n';
import store from "../src1/store/main_store";
import './src/createWeb3Modal'

// if (__DEV__) {
//   require("./ReactotronConfig");
// }

interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: { allowFontScaling?: boolean };
}
interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}

(TextInput as unknown as TextInputWithDefaultProps).defaultProps = {
  ...((TextInput as unknown as TextInputWithDefaultProps).defaultProps || {}),
  allowFontScaling: false,
};

(Text as unknown as TextWithDefaultProps).defaultProps = {
  ...((Text as unknown as TextWithDefaultProps).defaultProps || {}),
  allowFontScaling: false,
};

const App = () => {
  return (
    <Provider store={store}>
      <StatisticsProvider>
        <I18nextProvider i18n={i18n}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Root />
          </GestureHandlerRootView>
        </I18nextProvider>
      </StatisticsProvider>
  </Provider>
  );
};

export default App;
*/
