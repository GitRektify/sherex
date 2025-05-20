import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import {useTranslation} from 'react-i18next';

import {WETH_ADDRESS} from '@/utils/constants';

import FoxHeaderIcon from '@/assets/svg/fox-head.svg';
import SwapDownIcon from '@/assets/svg/swap-down.svg';
import ArrowDownIcon from '@/assets/svg/arrow-down.svg';
import {useAccount} from 'wagmi';
import {useSelector} from 'react-redux';

import TokenSelectButtonGroup from '@/screens/liquidity/components/TokenSelectButtonGroup';
import {getNativeBalance, getTokenBalance} from '@/utils/contract';
const ChartCardGroup = ({info, setInfo, tokens}) => {
  const [token0Balance, setToken0Balance] = useState('0.00');
  const [token1Balance, setToken1Balance] = useState('0.00');

  console.log('Info:', info);
  const {tokens: tokensInfo} = useSelector(state => state.tokens);
  const token0 = tokensInfo.filter(token => token.id === info.token0.address);
  let token0Price = 0;
  if (token0.length > 0) {
    token0Price = token0[0].price;
  }

  const token1 = tokensInfo.filter(token => token.id === info.token1.address);
  let token1Price = 0;
  if (token1.length > 0) {
    token1Price = token1[0].price;
  }
  // const { isConnected } = useWalletConnect();
  const [isActiveDown, setIsActiveDown] = useState(false);
  const {address} = useAccount();
  const {t} = useTranslation();

  const handleChangeAmount0 = amount => {
    if (/^\d*\.?\d*$/.test(amount)) {
      let normalizedAmount = amount;

      if (normalizedAmount === '.') {
        normalizedAmount = '0.';
      } else if (
        normalizedAmount.startsWith('.') &&
        normalizedAmount.length > 1
      ) {
        normalizedAmount = '0' + normalizedAmount;
      }

      let amount1 = '0'; // Default to '0' instead of ''

      if (
        normalizedAmount !== '' &&
        normalizedAmount !== '0.' &&
        !normalizedAmount.endsWith('.') &&
        !isNaN(normalizedAmount)
      ) {
        const numeric0 = parseFloat(normalizedAmount);
        if (!isNaN(numeric0) && token0Price && token1Price) {
          const ratio = token0Price / token1Price;
          amount1 = (numeric0 * ratio).toFixed(6);
        }
      }

      setInfo({...info, amount0: normalizedAmount, amount1});
    }
  };

  const handleSwapDown = () => {
    setIsActiveDown(!isActiveDown);
    setInfo({
      ...info,
      token0: info.token1,
      token1: info.token0,
      amount0: info.amount1,
      amount1: info.amount0,
    });
  };

  const handleUseMax = () => {
    setInfo({...info, amount0: token0Balance});
  };

  useEffect(() => {
    const fetchBalances = async () => {
      let balance0 =
        info.token0.address === WETH_ADDRESS.toLowerCase() &&
        info.token0.isNative
          ? await getNativeBalance(address as any)
          : await getTokenBalance(info.token0.address, address as any);

      let balance1 =
        info.token1.address === WETH_ADDRESS.toLowerCase() &&
        info.token1.isNative
          ? await getNativeBalance(address as any)
          : await getTokenBalance(info.token1.address, address as any);

      if (balance0 || balance1) {
        setToken0Balance(Number(balance0).toFixed(5));
        setToken1Balance(Number(balance1).toFixed(5));
      }
    };
    fetchBalances();
  }, [info]);

  // useEffect(() => {
  //   const fetchBalances = async () => {
  //     let balance0 =
  //       info.token0.address === WETH_ADDRESS.toLowerCase() && info.token0.isNative
  //         ? await getNativeBalance()
  //         : await getBalance(info.token0.address);

  //     let balance1 =
  //       info.token1.address === WETH_ADDRESS.toLowerCase() && info.token1.isNative
  //         ? await getNativeBalance()
  //         : await getBalance(info.token1.address);

  //     if (balance0 || balance1) {
  //       setToken0Balance(Number(balance0).toFixed(5));
  //       setToken1Balance(Number(balance1).toFixed(5));
  //     }
  //   };

  //   if (isConnected && info.token0 && info.token1) {
  //     fetchBalances();
  //   }
  // }, [info, isConnected]);

  return (
    <View style={styles.container}>
      {/* From Token Section */}
      <View style={styles.tokenContainer}>
        <View style={styles.maxButton}>
          <TouchableOpacity onPress={handleUseMax}>
            <Text style={styles.maxButtonText}>{t('swap.useMax')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tokenLabel}>{t('swap.from')}</Text>
        <TextInput
          style={styles.amountInput}
          onChangeText={handleChangeAmount0}
          placeholder="0"
          placeholderTextColor="white"
          keyboardType="decimal-pad" // more intuitive for calculator behavior
          value={info.amount0}
        />
        <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>{t('swap.balance') + ': '}</Text>
            <Text style={styles.balanceAmount}>
              {isActiveDown ? token1Balance : token0Balance}
            </Text>
          </View>
          <View style={[styles.tokenSelector, {zIndex: 1000}]}>
            <TokenSelectButtonGroup
              info={info}
              setInfo={setInfo}
              pairFor={0}
              tokens={tokens}
            />
          </View>
        </View>
      </View>

      {/* Swap Button */}
      <View style={styles.swapButtonContainer}>
        <FoxHeaderIcon style={styles.foxHeader} />
        <TouchableOpacity onPress={handleSwapDown} style={styles.swapButton}>
          <SwapDownIcon
            style={{transform: [{rotate: isActiveDown ? '180deg' : '0deg'}]}}
          />
        </TouchableOpacity>
      </View>

      {/* To Token Section */}
      <View style={styles.tokenContainer}>
        <Text style={styles.tokenLabel}>{t('swap.to')}</Text>
        <TextInput style={styles.amountDisplay} editable={false}>
          {info.amount1}
        </TextInput>
        <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>{t('swap.balance') + ': '}</Text>
            <Text style={styles.balanceAmount}>
              {isActiveDown ? token0Balance : token1Balance}
            </Text>
          </View>
          <View style={{zIndex: 999}}>
            <TokenSelectButtonGroup
              info={info}
              setInfo={setInfo}
              pairFor={1}
              tokens={tokens}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  tokenContainer: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(63, 63, 63, 0.3)',
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 12,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tokenLabel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    color: '#FFFFFF',
  },
  maxButton: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  maxButtonText: {
    position: 'absolute',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    right: 0,
  },
  amountInput: {
    paddingTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 26,
    color: '#FFFFFF',
  },
  amountDisplay: {
    paddingTop: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 26,
    color: '#FFFFFF',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenSelector: {
    // top: -8,
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 8,
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 50,
    // borderBottomLeftRadius: 30,
    // borderBottomRightRadius: 12,
    // gap: 20,
  },
  tokenContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 14,
  },
  tokenSymbol: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  balanceRow: {
    flexDirection: 'row',
  },
  balanceLabel: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 10,
    color: '#FFFFFF',
  },
  balanceAmount: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 10,
    color: '#FFFFFF',
  },
  swapButtonContainer: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none', // allows touches to pass through if needed
  },
  swapButton: {
    position: 'absolute',
    backgroundColor: '#FA5001',
    padding: 8,
    borderRadius: '100%',
    zIndex: 1,
  },
  foxHeader: {
    position: 'absolute',
    left: '5%',
    right: '95%',
    padding: 8,
    borderRadius: '100%',
    zIndex: 1,
  },
});

export default ChartCardGroup;
