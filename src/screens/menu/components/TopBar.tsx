import React, { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";

import SettingModal from "@/components/modal/SettingModal";
import ExchangeSettingModal from "@/components/modal/ExchangeSettingModal";
import { formatAddress } from "@/utils/index";
import NewTokenModal from "@/components/modal/NewTokenModal";
// import { Web3Modal } from "@/components/wallet/web3_modal";
// import { WalletDetailsModal } from "@/components/wallet/wallet_details_modal";

import ConnectionsScreen from '@/screens/Connections';

import FoxIcon from "@/assets/svg/fox-lie.svg";
// import SheRexIcon from "@/assets/svg/sherex.svg";
import PlusIcon from "@/assets/svg/plus.svg";
import WalletIcon from "@/assets/svg/wallet.svg";
import SettingIcon from "@/assets/svg/setting.svg";
import SherexPic from "@/assets/image/sherex.png";
import { useAccount, useSwitchChain } from "wagmi";
import { AppKitButton } from "@reown/appkit-wagmi-react-native";

console.log('PlusIcon:', PlusIcon);

const TopBar = () => {
  const { address, chainId, isConnected } = useAccount();
  const { switchChain } = useSwitchChain()
  const [isSettingModal, setIsSettingModal] = useState(false);
  const [isTokenModal, setIsTokenModal] = useState(false);
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [isWalletDetailsVisible, setIsWalletDetailsVisible] = useState(false);
  const { t } = useTranslation();

  const onConnect = useCallback(async () => {
    // if (isConnected) {
    //   setIsWalletDetailsVisible(true);
    // } else {
    //   setIsWalletModalVisible(true);
    // }
  }, [isConnected]);

  // const onDisconnect = useCallback(async () => {
  //   try {
  //     await disconnect();
  //     setIsWalletDetailsVisible(false);
  //   } catch (error) {
  //     console.error('Failed to disconnect:', error);
  //     Alert.alert('Error', 'Failed to disconnect wallet. Please try again.');
  //   }
  // }, [disconnect]);

  // const handleSelectWallet = useCallback(async (walletId: string) => {
  //   try {
  //     await open(walletId);
  //     setIsWalletModalVisible(false);
  //     if (address) {
  //       setIsWalletDetailsVisible(true);
  //     }
  //   } catch (error) {
  //     console.error('Failed to connect:', error);
  //     Alert.alert('Error', 'Failed to connect wallet. Please try again.');
  //   }
  // }, [open, address]);

  // const handleSwitchChain = useCallback(async (newChainId: number) => {
  //   try {
  //     await switchChain(newChainId);
  //   } catch (error) {
  //     console.error('Failed to switch chain:', error);
  //     Alert.alert('Error', 'Failed to switch chain. Please try again.');
  //   }
  // }, [switchChain]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={SherexPic} style={styles.sheRexIcon} />
        <View style={styles.buttonContainer}>
          {/* Plus Button */}
          <TouchableOpacity style={styles.smallButton} onPress={() => setIsTokenModal(true)}>
            <PlusIcon />
          </TouchableOpacity>
          {/* Setting Button */}
          <TouchableOpacity style={styles.smallButton} onPress={() => setIsSettingModal(true)}>
            <SettingIcon />
          </TouchableOpacity>
          {/* Connect Wallet Button */}
          <View style={styles.walletContainer}>
            <FoxIcon style={styles.foxIcon}/>
            <AppKitButton balance="hide" label="Connect Wallet" connectStyle={styles.connectButton} accountStyle={styles.accountButton}/>
          </View>
          {/* <View>
            <FoxIcon style={styles.foxIcon}/>
            <AppKitButton balance="hide" label="Connect Wallet" />
          </View> */}
        </View>
      </View>

      <SettingModal isVisible={isTokenModal} onClose={() => setIsTokenModal(false)} title={t("newTokenModal.title")} isSmall>
        <NewTokenModal title={undefined} />
      </SettingModal>
      <SettingModal isVisible={isSettingModal} onClose={() => setIsSettingModal(false)} title={t("exchangeModal.title")} isSmall>
        <ExchangeSettingModal />
      </SettingModal>
      {/* <ConnectionsScreen /> */}
      {/* <Web3Modal
        visible={isWalletModalVisible}
        onClose={() => setIsWalletModalVisible(false)}
        onSelectWallet={handleSelectWallet}
      />
      <WalletDetailsModal
        visible={isWalletDetailsVisible}
        onClose={() => setIsWalletDetailsVisible(false)}
        onDisconnect={onDisconnect}
        address={address}
        chainId={chainId}
        onSwitchChain={handleSwitchChain}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 0,
    width: "100%",
    paddingTop: 32,
    paddingHorizontal: 16,
    zIndex: 5555,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  sheRexIcon: {
    width: 70,
    height: 70,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#3F3F3F',
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    backgroundColor: "#FA5401",
  },
  connectButton: {
    height: 36,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FA5401",
  },
  accountButton: {
    height: 36,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  foxIcon: {
    position: 'absolute',
    top: -28,
    right: '50%',
  },
  walletText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
});

export default TopBar;
