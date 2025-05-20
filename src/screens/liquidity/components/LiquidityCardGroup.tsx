import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
// import { useAppKitAccount } from '@reown/appkit/react';
import {useSelector} from 'react-redux';
import {WETH_ADDRESS} from '@/utils/constants';
import {useTranslation} from 'react-i18next';
import TokenSelectButtonGroup from './TokenSelectButtonGroup';
import {getNativeBalance, getTokenBalance} from '@/utils/contract';
import {useAccount} from 'wagmi';

const LiquidityCardGroup = ({info, setInfo, tokens}) => {
  const [isActiveDown, setIsActiveDown] = useState(false);
  const [token0Balance, setToken0Balance] = useState('0.00');
  const [token1Balance, setToken1Balance] = useState('0.00');
  const {address} = useAccount();
  const {t} = useTranslation();

  const isConnected = false;
  // const { isConnected } = useAppKitAccount();

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

  const handleSwapDown = () => {
    setIsActiveDown(!isActiveDown);
  };

  // const handleChangeAmount0 = (amount) => {
  //     setInfo((prev) => ({ ...prev, amount0: amount }));
  // };
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

      setInfo({...info, amount0: normalizedAmount});
    }
  };

  const handleChangeAmount1 = amount => {
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
      setInfo({...info, amount1: normalizedAmount});
    }
  };

  const handleUseMax0 = () => {
    setInfo({...info, amount0: token0Balance});
  };

  const handleUseMax1 = () => {
    setInfo({...info, amount1: token1Balance});
  };

  useEffect(() => {
    const fetchBalances = async () => {
      let balance0;
      if (
        info.token0.address === WETH_ADDRESS.toLowerCase() &&
        info.token0.isNative === true
      ) {
        balance0 = await getNativeBalance(address as any);
      } else {
        balance0 = await getTokenBalance(info.token0.address, address as any);
      }
      let balance1;
      if (
        info.token1.address === WETH_ADDRESS.toLowerCase() &&
        info.token1.isNative === true
      ) {
        balance1 = await getNativeBalance(address as any);
      } else {
        balance1 = await getTokenBalance(info.token1.address, address as any);
      }
      if (balance0 || balance1) {
        setToken0Balance(Number(balance0).toFixed(5));
        setToken1Balance(Number(balance1).toFixed(5));
      }
    };
    if (
      isConnected &&
      info.token0 &&
      info.token0.address &&
      info.token1 &&
      info.token1.address
    ) {
      fetchBalances();
    }
  }, [info, isConnected]);

  return (
    <View style={styles.cardGroup}>
      {/* Card 1 - Token 0 */}
      <View style={s.box}>
        <TextInput
          style={s.amount}
          onChangeText={handleChangeAmount0}
          placeholder="0"
          placeholderTextColor="white"
          keyboardType="decimal-pad" // more intuitive for calculator behavior
          value={info.amount0}
        />
        <View style={[s.tokenRowContainer, {zIndex: 100}]}>
          <Text style={s.fiat}>-${token0Price * Number(info.amount0)}</Text>
          <TokenSelectButtonGroup
            info={info}
            setInfo={setInfo}
            pairFor={0}
            tokens={tokens}
          />
        </View>
      </View>

      {/* Card 2 - Token 1 */}
      <View style={s.box}>
        <TextInput
          style={s.amount}
          onChangeText={handleChangeAmount1}
          placeholder="0"
          placeholderTextColor="white"
          keyboardType="decimal-pad" // more intuitive for calculator behavior
          value={info.amount1}
        />
        <View style={[s.tokenRowContainer, {zIndex: 99}]}>
          <Text style={s.fiat}>-${token1Price * Number(info.amount1)}</Text>
          <TokenSelectButtonGroup
            info={info}
            setInfo={setInfo}
            pairFor={1}
            tokens={tokens}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardGroup: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 20,
  },
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    flexDirection: 'column',
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  useMaxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    width: '70%',
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  priceText: {
    color: '#88919e',
    fontSize: 16,
    fontWeight: '500',
  },
});

const s = StyleSheet.create({
  box: {
    // marginTop: 5,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3A3A3A',
    borderRadius: 12,
    // paddingHorizontal: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 8,
    width: '100%', // ≈344 px
  },
  amount: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '600',
    width: 200,
    // maxHeight: 50,
  },
  fiat: {
    color: '#8c8c8c',
    fontSize: 10,
  },
  tokenRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: '#333333',
  },
  icon: {width: 18, height: 18, marginRight: 6},
  symbol: {color: '#ffffff', fontSize: 10, marginLeft: 4, marginRight: 15},
  chevron: {width: 11, height: 11},
});

export default LiquidityCardGroup;
