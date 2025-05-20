import React, { useState, useEffect, useRef } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import LiquidityChart from "@/components/common/liquidity_chart";
import LiquidityViewDetail from "@/components/common/liquidity_view";
import DropdownResponsiveButton from "@/components/common/dropdown_responsive_button";
import { getTokenLogo, filterSwapsByTime, sampleData } from "@/utils/index";
import { staticTokens } from "@/utils/constants";
import { SHRX_TOKEN } from "@/utils/constants";
import { MainRouteProp } from "@/navigators/MainStackNavigator";
import TokenPairDetail from "./TokenPairDetail";
import { formatNumber } from "../../tokens/components/TokenTable";
import {
  CustomImage,
  FullScreenImage,
} from "@/components/general/shared_styled";
import { RouteProp } from "@react-navigation/native";
import { RootState } from "@/stores/index";
import ArrowLeftIcon from "@/assets/icon/arrow-left.svg";
import { setPools } from "@/stores/slices/pools";
import LoadingScreen from "@/components/common/Loader";

type RootStackParamList = {
  liquidityView: { id: string };
};

const LiquidityTokenView = ({ id, onBack }) => {
  console.log('---LiquidityTokenView---', id);
  const route = useRoute<RouteProp<RootStackParamList, "liquidityView">>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const { id } = route.params;
  const [liquidityData, setLiquidityData] = useState([]);
  const [selectedTime, setSelectedTime] = useState("1m");
  const { t } = useTranslation();
  const { pools, loading: poolsLoading } = useSelector(
    (state: RootState) => state.pools
  );
  const pool = pools.find((pool) => pool.id === id);
  const { swaps, loading: swapsLoading } = useSelector(
    (state: RootState) => state.swaps
  );

  // useEffect(() => {
  //   if (!pools || pools.length === 0) {
  //     // Add your API call here to fetch pools
  //     // const response = await fetchPools();
  //     // dispatch(setPools(response.data));
  //   }
  // }, [dispatch, pools]);
  // // const [token0Symbol, token1Symbol] = id.split("-");
  // const _pool = pools.find((pool) => {
  //   return (
  //     (pool.token0.symbol.toLowerCase() === token0Symbol.toLowerCase() &&
  //       pool.token1.symbol.toLowerCase() === token1Symbol.toLowerCase()) ||
  //     (pool.token0.symbol.toLowerCase() === token1Symbol.toLowerCase() &&
  //       pool.token1.symbol.toLowerCase() === token0Symbol.toLowerCase())
  //   );
  // }
  // );

  const options = [
    { value: "24h", label: "24h" },
    { value: "1w", label: "1w" },
    { value: "1m", label: "1M" },
  ];

  useEffect(() => {
    if (!pool || !swaps) return;
    const filteredSwaps = swaps.filter((swap) => swap.pool.id === pool.id);
    const filteredData = filteredSwaps.map((swap) => ({
      timestamp: swap.timestamp,
      liquidity: swap.liquidity,
    }));
    const liquidityData = filterSwapsByTime(filteredData, selectedTime);
    liquidityData.push({
      timestamp: Math.floor(Date.now() / 1000),
      liquidity: pool.liquidity,
    });
    liquidityData.push({
      timestamp: Math.floor(Date.now() / 1000) - 1000,
      liquidity: pool.liquidity,
    });
    let result = liquidityData;
    if (selectedTime === "24h") result = sampleData(liquidityData, 12);
    else if (selectedTime === "1w") result = sampleData(liquidityData, 7);
    else if (selectedTime === "1m") result = sampleData(liquidityData, 10);
    setLiquidityData(result);
  }, [pool, selectedTime, swaps]);

  if (poolsLoading || !pool) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingScreen />
        {/* <ActivityIndicator size="large" color="#F3BA2F" /> */}
      </View>
    );
  }

  const getTokenAddress = (symbol: any) => {
    const token = staticTokens.find(
      (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return token ? token.address : null;
  };

  const address0 =
    pool.token0.symbol.toLowerCase() === "shrx"
      ? SHRX_TOKEN.address
      : getTokenAddress(pool.token0.symbol);

  const address1 =
    pool.token1.symbol.toLowerCase() === "shrx"
      ? SHRX_TOKEN.address
      : getTokenAddress(pool.token1.symbol);
  const uri0 =
    pool.token0.symbol.toLowerCase() === "shrx" ? "sherex" : getTokenLogo(address0);

  const uri1 =
    pool.token1.symbol.toLowerCase() === "shrx" ? "sherex" : getTokenLogo(address1);

  console.log("-----Token0-----:", pool.token0.symbol, "Address0:", address0, "URI0:", uri0);
  console.log("-----Token1-----:", pool.token1.symbol, "Address1:", address1, "URI1:", uri1);

  const getImageSource = (uri: any) => {
    if (uri.startsWith("http") || uri.startsWith("https")) {
      return { uri };
    } else {
      if (uri.includes("sherex")) {
        return require("@/assets/image/sherex.png");
      }
    }
  };

  const isRemoteImage = (uri: any) =>
    uri.startsWith("http") || uri.startsWith("https");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <View style={styles.tokenPairContainer}>
          <View style={styles.tokenIconsContainer}>
            {isRemoteImage(uri0) ? (
              <CustomImage source={{ uri: uri0 }} style={styles.tokenIcon} />
            ) : (
              <Image source={getImageSource(uri0)} style={styles.tokenIcon} />
            )}
            {isRemoteImage(uri1) ? (
              <CustomImage source={{ uri: uri1 }} style={styles.tokenIcon} />
            ) : (
              <Image source={getImageSource(uri1)} style={[styles.tokenIcon, styles.secondTokenIcon]} />
            )}
          </View>
          <Text style={styles.tokenPairText}>
            {pool.token0.symbol}/{pool.token1.symbol}
          </Text>
        </View>
      </View>

      <View style={styles.priceInfoContainer}>
        <Text style={styles.priceInfoTitle}>{t("chartButtons.pairInfo")}</Text>
        <Text style={styles.priceInfoText}>
          1 {pool.token0.symbol} = {Number(pool.token1Price)?.toFixed(4)}{" "}
          {pool.token1.symbol}, 1 {pool.token1.symbol} ={" "}
          {Number(pool.token0Price)?.toFixed(4)} {pool.token0.symbol}
        </Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.infoRow}>
          <View style={styles.infoCell}>
            <Text style={styles.initText}>Fee Tier</Text>
            <Text style={styles.redRoundText}>V3 | 0.01%</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.initText}>Network</Text>
            <Text style={styles.initValue}>BNB Chain</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.initText}>APR</Text>
            <Text style={styles.initValue}>52.25%</Text>
          </View>
          <View style={styles.infoCell}>
            <Text style={styles.initText}>Pool Type</Text>
            <Text style={styles.redRoundText}>V3</Text>
          </View>
        </View>
        <TokenPairDetail pool={pool} />
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Poppins",
    fontStyle: "normal",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
  },
  title: {
    marginTop: 20,
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 22,
    color: "#FA5001",
  },
  subtitle: {
    paddingVertical: 4,
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 10,
    color: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#404040",
    // overflow: 'hidden',
    /* Note: backdrop-filter has minimal browser support */
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  backButton: {
    padding: 8,
  },
  tokenPairContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcon: {
    width: 20,
    height: 20,
    borderRadius: 16,
  },
  secondTokenIcon: {
    marginLeft: -8,
  },
  tokenPairText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
  },
  priceInfoContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    marginBottom: 24,
  },
  priceInfoTitle: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    marginHorizontal: 8,
  },
  priceInfoText: {
    color: "#FFFFFF",
    opacity: 0.8,
    fontSize: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    // marginBottom: 24,
  },
  infoCell: {
    alignItems: "center",
  },
  redRoundText: {
    color: "#FA5001",
    fontSize: 10,
    borderRadius: 7,
    borderColor: "#FA5001",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 8,
    minWidth: 60,
    textAlign: 'center',
  },
  initText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 400,
  },
  initValue: {
    marginTop: 10,
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 600,
  },
  chartContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
  },
});

export default LiquidityTokenView;
