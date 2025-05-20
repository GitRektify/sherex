import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

import {
  CustomImage,
  FullScreenImage,
} from "@/components/general/shared_styled";
import { getTokenLogo } from "@/utils/index";
import { SHRX_TOKEN } from "@/utils/constants";
import { staticTokens } from "@/utils/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";

import AddLiquidity from "./components/add_liquidity";

import FoxIcon from "@/assets/svg/fox-sit.svg";
import LiquidityTokenView from "./components/LiquidityTokenView";
import { getMasterChefPoolInfo, calculateApr } from "@/utils/index";

const Liquidity = () => {
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const { t } = useTranslation();

  const { tokens, loading: tokensLoading } = useSelector((state) => state.tokens);
  const { pools, loading: poolsLoading } = useSelector((state) => state.pools);
  const { masterChef, pools: masterChefPools, loading: masterChefPoolsLoading } = useSelector((state) => state.masterChef);
  const sherexTokens = tokens.filter((token) => token.id === SHRX_TOKEN.address);
  const sherexToken = sherexTokens.length > 0 ? sherexTokens[0] : null;

  // console.log('######## POOLS #######', pools);
  const [info, setInfo] = useState({
    token0: {
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      name: "Wrapped BNB",
      symbol: "WBNB",
      decimals: 18,
      logo: 'https://bscscan.com/token/images/bnbchain2_32.png'
    },
    token1: {
      address: "0x55d398326f99059ff775485246999027b3197955",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 18,
      logo: 'https://bscscan.com/token/images/busdt_32.png'
    },
    fee: '0.25',
    tickLower: -10000,
    tickUpper: 10000,
    range: 10,
    minVal: 0,
    maxVal: 100,
    amount0: 0,
    amount1: 0
  })

  // const [tokens, setTokens] = useLocalStorage('tokens', []);

  const getTokenAddress = (symbol: any) => {
    const token = staticTokens.find(
      (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return token ? token.address : null;
  };

  const renderPoolRow = (pool: any, index) => {
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

    console.log("Token0:", pool.token0.symbol, "Address0:", address0, "URI0:", uri0);
    console.log("Token1:", pool.token1.symbol, "Address1:", address1, "URI1:", uri1);

    const masterChefPool = getMasterChefPoolInfo(masterChefPools, pool.id);
    const apr = masterChefPool ? calculateApr(pool, masterChef, masterChefPools, sherexToken) : 0;
    // console.log('&&&&&&&&&&&& mastechefpools &&&&&&&&&&', masterChefPools)
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

    const handleSelectToken = (poolId) => {
      setSelectedToken(poolId);
    };

    return (
      <TouchableOpacity
        key={'pool-id-' + index}
        style={styles.poolRow}
        // onPress={() => handleNavigateToView(pool.id)}
        onPress={() => handleSelectToken(pool.id)}
      >
        <View style={styles.poolInfo}>
          <View style={styles.tokenPair}>
            <View style={styles.tokenIcons}>
              {isRemoteImage(uri0) ? (
                <CustomImage source={{ uri: uri0 }} style={styles.tokenIcon} />
              ) : (
                <Image source={getImageSource(uri0)} style={styles.tokenIcon} />
              )}
              {isRemoteImage(uri1) ? (
                <CustomImage
                  source={{ uri: uri1 }}
                  style={[styles.tokenIcon, styles.secondToken]}
                />
              ) : (
                <Image
                  source={getImageSource(uri1)}
                  style={[styles.tokenIcon, styles.secondToken]}
                />
              )}
            </View>
            <Text style={styles.pairText}>
              {pool.token0.symbol}/{pool.token1.symbol}
            </Text>
          </View>

          <View style={styles.aprContainer}>
            <Text style={styles.aprText}>{masterChefPool ? apr.toFixed(5) : 0}%</Text>
            <View style={styles.statusDot} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FullScreenImage
        source={require("../../../assets/image/background.png")}
      />
      {selectedToken ? (
        <LiquidityTokenView id={selectedToken} onBack={() => setSelectedToken(null)} />
      ) : (<>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Liquidity Pools</Text>
            <Text style={styles.subtitle}>Provide liquidity, earn yields.</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FoxIcon style={styles.foxIcon} />
          <LinearGradient
            colors={["rgba(34, 34, 34, 0.6)", "rgba(34, 34, 34, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.contentContainer}
          >
            {selectedAdd ? (
              <AddLiquidity info={info} setInfo={setInfo} tokens={tokens} onBack={() => setSelectedAdd(null)} />
            ) : (
              <>
                <View style={styles.searchContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search All"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                    />
                    <TouchableOpacity
                      onPress={() => setSelectedAdd(1)}
                    >
                      <Text style={styles.createButton}>Add Liquidity</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.listHeader}>
                  <Text style={styles.listHeaderText}>Pool</Text>
                  <Text style={styles.listHeaderText}>Volume (24h)/APR</Text>
                </View>

                <ScrollView style={styles.poolsList}>
                  {pools.map(renderPoolRow)}
                </ScrollView>
              </>
            )}
          </LinearGradient>
        </View>
      </>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 100,
    fontFamily: "Poppins",
    fontStyle: "normal",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginTop: 100,
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
  foxIcon: {
    position: "absolute",
    height: 24,
    top: -24,
    right: "30%",
  },
  createButton: {
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#FA5001",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#FA5001",
    borderRadius: 8,
    width: 85,
    height: 30,
    alignItems: "center",
    padding: 0,
    color: "#FFFFFF",
    fontSize: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    padding: 16,
    alignContent: "center",
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    width: "70%",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  listHeaderText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
  poolsList: {
    flex: 1,
    padding: 16,
  },
  poolRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  poolInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tokenPair: {
    flexDirection: "row",
    alignItems: "center",
  },
  tokenIcons: {
    flexDirection: "row",
    marginRight: 12,
    alignItems: "center",
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  secondToken: {
    marginLeft: -8,
  },
  pairText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  aprContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  aprText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
});

export default Liquidity;
