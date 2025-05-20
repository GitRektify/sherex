import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatUnits, parseUnits } from 'ethers';
import { LinearGradient } from 'react-native-linear-gradient';

import ChartCardGroup from './ChartCardGroup';
import ChartSwapPreview from './ChartSwapPreview';
import { useBnbContract, useQuote, useSwap, useTokenContract } from '@/hooks/useActions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { staticTokens, contractAddresses, WETH_ADDRESS } from '@/utils/constants';

import SettingIcon from '@/assets/svg/setting-small.svg'
import { quote } from '@/utils/contract';

const ChartSwapHeader = (props) => {
  const { info, setInfo, liquiditySlippage, handleSetting } = props;
  const [isDetail, setIsDetail] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [tokens] = useLocalStorage('tokens', []);
  const { executeSwap, isPending: isSwapping } = useSwap();

  const updateInfo = (newInfo) => {
    const { token0, token1, amount0 } = newInfo;
    setInfo(newInfo);
    if (!token0?.decimals || !token1?.decimals) return;

    const token0Amount = amount0 === 0 ? 0 : parseUnits(amount0.toString(), token0.decimals);
    quote(token0.address, token1.address, 2500, token0Amount).then((value) => {
      if (value) {
        const formattedAmount1 = formatUnits(value, token1.decimals);
        setInfo(prev => ({ ...prev, amount1: Number(formattedAmount1).toFixed(4) }));
      } else {
        setInfo(prev => ({ ...prev, amount1: 0 }));
      }
    });
  };

  const handleSwap = async () => {
    if (!info?.amount0 || !info?.token0?.decimals) return;

    const token0Amount = parseUnits(info.amount0.toString(), info.token0.decimals);
    executeSwap(
      info.token0.address,
      info.token1.address,
      2500,
      token0Amount,
      info.token0.isNative
    );
  };

  return (
    <View style={styles.container}>
      {isDetail ? (
        <LinearGradient
          colors={['#22222299', '#222222CC']}
          style={styles.mainContainer}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("swap.swap")}</Text>
            <TouchableOpacity onPress={handleSetting}>
              <SettingIcon style={styles.setting} />
            </TouchableOpacity>
          </View>

          <ChartCardGroup info={info} setInfo={updateInfo} tokens={tokens} />

          <View style={styles.slippageRow}>
            <Text style={styles.slippageLabel}>{t("swap.slippageTolerance")}</Text>
            <Text style={styles.slippageValue}>{liquiditySlippage}%</Text>
          </View>

          <TouchableOpacity style={styles.enterButton} onPress={handleSwap}>
            {loading ? (
              <ActivityIndicator size="small" color="#F3BA2F" />
            ) : (
              <Text style={styles.enterButtonText}>{t("swap.enterAmount")}</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      ) : (
        <ChartSwapPreview handleDetail={() => setIsDetail(true)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden', // Ensures the blur effect stays within the rounded corners
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#404040',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingLeft: 16,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 26,
    color: '#FFFFFF',
  },
  setting: {
    // width: 110,
    // height: 200,
  },
  slippageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 4,
    // marginTop: 8,
  },
  slippageLabel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  slippageValue: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    textAlign: 'right',
    color: '#FFFFFF',
  },
  enterButton: {
    backgroundColor: '#FA5001',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  enterButtonText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
});

export default ChartSwapHeader;
