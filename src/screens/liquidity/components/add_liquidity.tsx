import React, { useState, useRef, useEffect } from 'react';
import { Button, Pressable } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, PanResponder, Animated, Dimensions, LayoutChangeEvent, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'react-native-linear-gradient';
import { CustomImage, FontWeight, FullScreenImage } from '@/components/general/shared_styled';
import { getSqrtPriceX96, getTickBounds, TICK_SPACINGS, getTokenLogo } from '@/utils/index';
import { SHRX_TOKEN } from '@/utils/constants';
import { staticTokens } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import LiquidityCardGroup from './LiquidityCardGroup';
import { parseUnits } from 'ethers';
import { WETH_ADDRESS } from '@/utils/constants';
import { contractAddresses } from '@/utils/constants';
import { useBnbContract, useLiquidity, useTokenContract } from '@/hooks/useActions';

import SettingIcon from "@/assets/svg/setting-small.svg";
import EthIcon from "@/assets/svg/token/ETH.svg"
import BnbIcon from "@/assets/svg/token/BNB.svg";
import ArrowIcon from "@/assets/svg/arrow.svg";
import MinusIcon from "@/assets/svg/minus-price.svg";
import PlusIcon from "@/assets/svg/plus-price.svg";
import Chart from "@/assets/svg/chart.svg";
import LeftHandler from "@/assets/svg/left-handler.svg";
import RightHandler from "@/assets/svg/right-handler.svg";


const percentages = [
  { value: '0.01%', pick: '0% Pick' },
  { value: '0.05%', pick: '0% Pick' },
  { value: '0.25%', pick: '100% Pick' },
  { value: '1%', pick: '0% Pick' },
];

const range = [
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
  { value: 50, label: '50%' },
  { value: 100, label: 'Full Range' }
];

const AddLiquidity = ({ info, setInfo, tokens, onBack }) => {
  const percentage = ['0.01%', '0.05%', '0.25%', '1%']
  console.log('****in Mobile tokesns****', tokens)

  const { tokens: tokensInfo } = useSelector((state) => state.tokens);
  const { token0, token1, range: rangePercentage, amount0, amount1 } = info;
  const [priceRange, setPriceRange] = useState(rangePercentage);
  const price = amount1 > 0 ? amount0 / amount1 : 0;
  const currentPrice = token0.address && token1.address && amount0 !== 0 && amount1 !== 0 ? (token0.address.toLowerCase() < token1.address.toLowerCase() ? 1 / price : price) : 0;

  const [minVal, setMinVal] = useState(0);
  const [maxVal, setMaxVal] = useState(100);
  let token0Price = 0;
  if (token0.length > 0) {
    token0Price = token0[0].price;
  }

  const { approve: approveToken } = useTokenContract();
  const { addLiquidity } = useLiquidity();
  const { depositWBNB } = useBnbContract();
  const [percent, setPercent] = useState('0.01%');
  const { t } = useTranslation();

  const getTokenAddress = (symbol) => {
    const token = staticTokens.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
    return token ? token.address : null;
  };

  const handleChangeAmount0 = (amount) => {
    setInfo(prev => ({ ...prev, amount0: amount }));
  }

  const handleChangeAmount1 = (amount) => {
    setInfo(prev => ({ ...prev, amount1: amount }));
  }

  const handleUseMax0 = () => {
    setInfo({ ...info, amount0: token0Balance });
  }

  const handleUseMax1 = () => {
    setInfo({ ...info, amount1: token1Balance });
  }


  // const [selected, setSelected] = useState('0.25%');
  const [selected_2, setSelected_2] = useState('10%');

  const [containerWidth, setContainerWidth] = useState(0);

  const buttonWidth_1 = containerWidth
    ? (containerWidth - 28) / 4
    : 0;
  const buttonWidth_2 = containerWidth
    ? (containerWidth - 20) / 2
    : 0;

  const handlerWidth = 20; // Width of the handler
  const chartWidth = Dimensions.get('window').width - 40; // Width of the chart (adjust as necessary)

  const initialLeft = (chartWidth - 40) / 2 - 100;
  const initialRight = (chartWidth - 40) / 2 + 100;

  const leftPan = useRef(new Animated.Value(initialLeft + handlerWidth)).current; // Move to right end
  const rightPan = useRef(new Animated.Value(initialRight)).current;

  const [leftX, setLeftX] = useState(initialLeft + handlerWidth);
  const [rightX, setRightX] = useState(initialRight);

  // PanResponder for Left Handler
  const leftResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        leftPan.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        let moveX = gestureState.dx;
        leftPan.setValue(moveX);
      },
      onPanResponderRelease: () => {
        leftPan.flattenOffset();
        leftPan.stopAnimation((value) => {
          let clamped = Math.max(handlerWidth / 2, Math.min(value, rightX));
          leftPan.setValue(clamped);
          setLeftX(clamped);
        });
      }
    })
  ).current;

  const rightResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        rightPan.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        let moveX = gestureState.dx;
        rightPan.setValue(moveX);
      },
      onPanResponderRelease: () => {
        rightPan.flattenOffset();
        rightPan.stopAnimation((value) => {
          let clamped = Math.max(leftX, Math.min(value, chartWidth - 20));
          rightPan.setValue(clamped);
          setRightX(clamped);
        });
      }
    })
  ).current;
  const [loading, setLoading] = useState(false);
  const handleAddLiquidity = async () => {
    const { token0, token1, fee, amount0, amount1, minVal, maxVal } = info;
    setLoading(true);
    try {
      const token0Amount = parseUnits(amount0, token0.decimals);
      const token1Amount = parseUnits(amount1, token1.decimals);

      // Calculate raw price without decimal adjustment

      // If token0 address is smaller, we need the reciprocal of the price
      const price = amount0 / amount1;
      let currentPrice = 0;
      if (token0 && token1) {
        currentPrice = token0.address.toLowerCase() < token1.address.toLowerCase() ? 1 / price : price;
      }

      // getSqrtPriceX96 will handle the decimal adjustments
      const sqrtPriceX96 = getSqrtPriceX96(
        currentPrice,
        token0,
        token1
      );
      ////console.log('sqrtPriceX96:', sqrtPriceX96.toString());

      // Calculate price range (adjusted to be more conservative)
      const [decimals0, decimals1] = token0.address.toLowerCase() < token1.address.toLowerCase() ? [token0.decimals, token1.decimals] : [token1.decimals, token0.decimals];
      const minPrice = currentPrice * 10 ** (decimals1 - decimals0) * 90 / 100;  // 5% below current price
      const maxPrice = currentPrice * 10 ** (decimals1 - decimals0) * 110 / 100;  // 5% above current price

      const feeTier = Number(fee) * 10000;

      // Get adjusted ticks based on price range and fee tier
      const { tickLower, tickUpper } = getTickBounds(
        minPrice,
        maxPrice,
        TICK_SPACINGS[feeTier]
      );

      console.log("adding liquidity...")

      addLiquidity(
        token0.address.toLowerCase(),
        token1.address.toLowerCase(),
        feeTier,
        tickLower,
        tickUpper,
        token0Amount,
        token1Amount,
        sqrtPriceX96,
        token0.isNative,
        token1.isNative,
      );

    } catch (err) {
      console.error('Add liquidity failed:', err);
      // You might want to add user feedback here
    }
    setLoading(false);
  }

  useEffect(() => {
    handlePriceRangeChange(rangePercentage);
  }, [token0, token1, amount0, amount1])

  // Update price range based on selected percentage
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);

    let minVal = 0;
    let maxVal = 0;
    switch (range) {
      case 10:
        setMinVal((currentPrice * 0.9).toFixed(2));  // -10%
        setMaxVal((currentPrice * 1.1).toFixed(2));  // +10%
        minVal = (currentPrice * 0.9).toFixed(2);
        maxVal = (currentPrice * 1.1).toFixed(2);
        break;
      case 20:
        setMinVal((currentPrice * 0.8).toFixed(2));  // -20%
        setMaxVal((currentPrice * 1.2).toFixed(2));  // +20%
        minVal = (currentPrice * 0.8).toFixed(2);
        maxVal = (currentPrice * 1.2).toFixed(2);
        break;
      case 50:
        setMinVal((currentPrice * 0.5).toFixed(2));  // -50%
        setMaxVal((currentPrice * 1.5).toFixed(2));  // +50%
        minVal = (currentPrice * 0.5).toFixed(2);
        maxVal = (currentPrice * 1.5).toFixed(2);
        break;
      case 100:
        setMinVal(0);  // Minimum possible
        setMaxVal((currentPrice * 2).toFixed(2));  // 500% of current price
        minVal = 0;
        maxVal = (currentPrice * 2).toFixed(2);
        break;
      default:
        break;
    }

    setInfo(prev => ({ ...prev, range: range, minVal: minVal, maxVal: maxVal }));
  };

  // Update handlers for min and max price buttons
  const handleMinPriceChange = (amount) => {
    const currentValue = parseFloat(minVal) || 0;
    let newValue;

    if (amount > 0) {
      // Increase by 1% of current price
      newValue = currentValue + (currentPrice * 0.01);
    } else {
      // Decrease by 1% of current price
      newValue = currentValue - (currentPrice * 0.01);
    }

    // Ensure newValue doesn't go below 0 or above current price
    newValue = Math.max(0, Math.min(newValue, currentPrice * 0.99));  // Keep below current price
    setMinVal(newValue);
    setInfo(prev => ({ ...prev, minVal: newValue }));
    setPriceRange('custom');  // Switch to custom range
  };

  const handleMaxPriceChange = (amount) => {
    const currentValue = parseFloat(maxVal) || currentPrice;
    let newValue;

    if (amount > 0) {
      // Increase by 1% of current price
      newValue = currentValue + (currentPrice * 0.01);
    } else {
      // Decrease by 1% of current price
      newValue = currentValue - (currentPrice * 0.01);
    }

    // Ensure newValue doesn't go below 101% of current price
    newValue = Math.max(currentPrice * 1.01, newValue);
    setMaxVal(newValue);
    setInfo(prev => ({ ...prev, maxVal: newValue }));
    setPriceRange('custom');  // Switch to custom range
  };

  return (
    <View
      style={styles.addLiquidity}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}>
      <View style={styles.listHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons style={styles.arrow} name="arrow-back" />
          <Text style={styles.initText}>{'Add Liquidity'}</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.listHeaderText}>APR (with farming)</Text>
          <View style={styles.settingButton}>
            <Text style={styles.initText}>55.29% </Text>
            {/* <SettingIcon /> */}
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View>
          <View>
            <Text style={styles.chapter}>{'Choose Token Pair and Deposit Amount'}</Text>
          </View>

          <LiquidityCardGroup info={info} setInfo={setInfo} tokens={tokens} />

          <View style={styles.feeTier}>
            <View style={styles.rowAlign}>
              <Text style={styles.initText}>Fee's tier - </Text>
              <Text style={styles.redBoldText} >{percent} Fee Tier</Text>
            </View>
            <View style={styles.redradiusRect}>
              <Text style={styles.redSmallText}>100% Pick</Text>
            </View>
          </View>

          <View style={buttonGroup.buttonContainer}>
            {percentages.map((item, index) => (
              <TouchableOpacity
                key={'add-liquidity-' + index}
                style={[
                  buttonGroup.button,
                  { width: buttonWidth_1 },
                  percent === item.value && buttonGroup.selectedButton,
                ]}
                onPress={() => setPercent(item.value)}
              >
                <Text
                  style={[
                    buttonGroup.valueText,
                    percent === item.value && buttonGroup.selectedText,
                  ]}
                >
                  {item.value}
                </Text>
                <Text
                  style={[
                    buttonGroup.pickText,
                    percent === item.value && buttonGroup.selectedText,
                  ]}
                >
                  {item.pick}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>
        <View style={styles.poolLock}>
          <Text style={styles.poolTitle}>Pool Lock (optional)</Text>
          <TextInput
            style={styles.enterLock}
            placeholder="Enter Lock Period in Months"
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>

        <View>
          <Text style={styles.chapter}>
            Set Price Range
          </Text>
          <Text style={styles.currentContainer}>
            Current Price: 0.05 ETH per BNB
          </Text>
          <View style={handle.chartWrapper}>
            {/* Chart */}
            <Chart width="100%" />

            <View style={handle.handlerOverlay}>
              <Animated.View
                style={[
                  {
                    transform: [{ scaleX: -1 }],
                    left: leftPan,
                    width: Animated.subtract(rightPan, leftPan),
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(243, 186, 47, 0.2)', 'rgba(207, 125, 51, 0.1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
              <Animated.View
                style={[
                  handle.middleLine,
                  {
                    transform: [{ translateX: Animated.add(leftPan, Animated.divide(Animated.subtract(rightPan, leftPan), 2)) }]
                  }
                ]} />
              <Animated.View
                {...leftResponder.panHandlers}
                style={[
                  handle.handler,
                  {
                    transform: [{ translateX: Animated.subtract(leftPan, handlerWidth / 2) }],
                  },
                ]}
              >
                <LeftHandler />
              </Animated.View>

              <Animated.View
                {...rightResponder.panHandlers}
                style={[
                  handle.handler,
                  {
                    transform: [{ translateX: rightPan }],
                  },
                ]}
              >
                <RightHandler />
              </Animated.View>
            </View>
          </View>
          <View style={styles.numAlign}>
            <Text style={styles.initText}>0</Text>
            <Text style={styles.initText}>100</Text>
            <Text style={styles.initText}>200</Text>
            <Text style={styles.initText}>300</Text>
            <Text style={styles.initText}>400</Text>
            <Text style={styles.initText}>500</Text>
          </View>
        </View>

        <View style={styles.currentPrice}>
          <Text style={styles.initText}>Current Price</Text>
          <Text style={styles.redBigBoldText}>{currentPrice}</Text>
        </View>

        <View style={styles.priceContainer}>
          <View style={[
            buttonGroup.button_2,
            { width: buttonWidth_2 }]}>
            <Text style={styles.initText}>Min Price</Text>
            <View style={styles.priceBoxItems}>
              <Pressable
                style={styles.minButton}
                onPress={() => handleMinPriceChange(-1)}
              >
                <MinusIcon />
              </Pressable>
              <Text style={styles.zero}>{Number(minVal).toFixed(2)}</Text>
              <Pressable
                style={styles.maxButton}
                onPress={() => handleMinPriceChange(1)}
              >
                <PlusIcon />
              </Pressable>
            </View>
            <Text style={styles.initText}>{token0.symbol} per {token1.symbol}</Text>
          </View>
          <View style={[
            buttonGroup.button_2,
            { width: buttonWidth_2 }]}>
            <Text style={styles.initText}>Max Price</Text>
            <View style={styles.priceBoxItems}>
              <Pressable
                style={styles.minButton}
                onPress={() => handleMaxPriceChange(-1)}
              >
                <MinusIcon />
              </Pressable>
              <Text style={styles.zero}>{Number(maxVal).toFixed(2)}</Text>
              <Pressable
                style={styles.maxButton}
                onPress={() => handleMaxPriceChange(1)}
              >
                <PlusIcon />
              </Pressable>
            </View>
            <Text style={styles.initText}>{token0.symbol} per {token1.symbol}</Text>
          </View>
        </View>

        <View style={buttonGroup_2.buttonContainer}>
          {range.map((range) => (
            <TouchableOpacity
              key={range.value}
              activeOpacity={1}
              style={[
                buttonGroup_2.button,
                { width: buttonWidth_1 },
                selected_2 === range.label && buttonGroup_2.selectedButton,
              ]}
              onPress={() => { setSelected_2(range.label), handlePriceRangeChange(range.value) }}
            >
              <Text
                style={[
                  buttonGroup_2.valueText,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.enterAmount}
          onPress={handleAddLiquidity}>
          <Text style={styles.enterText}>ENTER AMOUNT</Text>
        </TouchableOpacity>
      </ScrollView>
    </View >
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  addLiquidity: {
    flex: 1,
    overflow: 'hidden',
    padding: 8,
    /* Note: backdrop-filter has minimal browser support */
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center', // ← makes sure arrow and text are vertically aligned
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center', // ← makes sure arrow and text are vertically aligned
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  arrow: {
    marginRight: 5,
    color: "#FFFFFF",
  },
  initText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 400,
  },
  redText: {
    color: '#FA5001',
    fontSize: 10,
    fontWeight: 400,
  },
  redBoldText: {
    color: '#FA5001',
    fontSize: 10,
    fontWeight: 800,
  },
  redBigBoldText: {
    color: '#FA5001',
    fontSize: 12,
    fontWeight: 800,
  },
  redSmallText: {
    color: '#FA5001',
    fontSize: 10,
    fontWeight: 400,
    margin: 6,
    marginVertical: 3,
  },
  redradiusRect: {
    borderColor: '#FA5001',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 7,
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  listHeaderText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  chapter: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 400,
    marginTop: 25,
    marginBottom: 10,
  },
  rowAlign: {
    flexDirection: 'row',
  },
  numAlign: {
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  poolLock: {
    paddingVertical: 6,
  },
  poolTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 400,
  },
  enterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
  },
  enterLock: {
    fontSize: 10,
    marginTop: 12,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3A3A3A',
    borderRadius: 12,
    width: '100%',
    color: '#FFFFFF',
    padding: 15,
  },
  currentPrice: {
    marginTop: 12,
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3A3A3A',
    borderRadius: 12,
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feeTier: {
    marginTop: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  priceBox: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3A3A3A',
    borderRadius: 12,
  },
  priceBoxItems: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  minButton: {
    // position: 'absolute',
    left: '0%',
  },
  maxButton: {
    // position: 'absolute',
    right: '0%',
  },
  zero: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 500,
    // position: 'absolute',
  },
  enterAmount: {
    backgroundColor: '#FA5001',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FA5001',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
  },
  currentContainer: {
    marginTop: 4,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 400,
  },
});

const buttonGroup = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  button_2: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FA5001',
    borderColor: '#FA5001',
  },
  valueText: {
    color: '#ffffff',
    fontWeight: '400',
    fontSize: 10,
  },
  pickText: {
    color: '#FA5001',
    fontSize: 10,
    marginTop: 4,
  },
  selectedText: {
    color: '#ffffff',
  },
});

const buttonGroup_2 = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#2A2A2A',
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#FA5001',
  },
  valueText: {
    color: '#ffffff',
    fontWeight: '400',
    fontSize: 10,
  },
});

const handle = StyleSheet.create({
  chartWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },

  handlerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between', // If you want the handlers at the ends of the chart
  },

  handler: {
    position: 'absolute',
    top: 0,
    width: 4, // Set the width of the handler
    height: 20, // Set the height of the handler
    borderRadius: 10, // Make the handler circular
    // Optional: add transform for better positioning
    // transform: [{ translateX: -12 }],
  },
  selection: {
    position: 'absolute',
    height: '100%', // or fixed like 40
    borderRadius: 2,
  },
  middleLine: {
    height: '100%',
    width: 0,
    position: 'absolute',
    borderStyle: 'dashed',
    borderColor: '#FA5401',
    borderWidth: 0.6,
  }
});

export default AddLiquidity;
