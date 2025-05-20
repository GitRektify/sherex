import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    GestureResponderEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
    Defs,
    LinearGradient,
    Stop,
    Circle,
    G,
    Line,
    Text as SvgText,
} from "react-native-svg";
import { LineChart, AreaChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
// import * as Haptics from "expo-haptics";

import { TokenData } from "../../tokens/components/TokenTable";

import { CustomImage } from "@/components/general/shared_styled";
import { SHRX_TOKEN } from "@/utils/constants";
import { getTokenLogo } from "@/utils/index";
import { staticTokens } from "@/utils/constants";
import { formatNumber } from "../../tokens/components/TokenTable";

import FoxIcon from "@/assets/svg/fox-sit.svg";
import EthIcon from "@/assets/svg/token_type_2/ETH.svg";
import BnbIcon from "@/assets/svg/token_type_2/BNB.svg";

const chartData = {
    Volume: [
        0.92, 0.89, 0.93, 0.91, 0.95, 0.97, 0.96, 0.99, 1.0, 0.98, 0.97, 1.01, 1.0,
        0.99, 1.0005,
    ],
    Liquidity: [
        0.85, 0.88, 0.86, 0.89, 0.91, 0.94, 0.96, 0.99, 0.98, 0.97, 0.95, 0.93,
        0.91,
    ],
    Fees: [
        0.75, 0.78, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.97, 1.0, 0.98, 0.95, 0.92,
    ],
};

const chartTitle = {
    Volume: "24 Hours",
    Liquidity: "1 Week",
    Fees: "1 Month",
};

const chartLineNumber = {
    Volume: 24,
    Liquidity: 7,
    Fees: 30,
};

const chartHorizontal = {
    Volume: [0, 4, 8, 12, 16, 20, 24],
    Liquidity: [0, 1, 2, 3, 4, 5, 6, 7],
    Fees: [0, 5, 10, 15, 20, 25, 30],
};

const TokenPairDetail = (pool) => {
    pool = pool.pool;
    console.log('*****In TokenPairDetail*****', pool);
    const [selectedTimeframe, setSelectedTimeframe] = useState<
        "Volume" | "Liquidity" | "Fees"
    >("Volume");
    const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
    const data = chartData[selectedTimeframe];
    const dataOffset = Math.max(...data) - Math.min(...data);
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 60;

    const Gradient = ({ offset }: any) => (
        <Defs key="gradient">
            <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset={offset} stopColor="#fa6d01" stopOpacity={0} />
                <Stop offset="0" stopColor="#fa6d01" stopOpacity={0.4} />
            </LinearGradient>
        </Defs>
    );

    const VerticalLine = () => {
        const verticalLines = [];
        const lineNumber = chartLineNumber[selectedTimeframe];
        for (let i = 0; i <= lineNumber; i++) {
            verticalLines.push(
                <Line
                    key={"token-chart-vertical-line-" + i}
                    x1={(i * 100) / lineNumber + "%"}
                    x2={(i * 100) / lineNumber + "%"}
                    y1={"0%"}
                    y2={"100%"}
                    stroke="rgba(240, 241, 255, 0.1)"
                    strokeWidth={1}
                // strokeDasharray={[4, 4]}
                />
            );
        }

        return <View>{verticalLines}</View>;
    };

    const Tooltip = ({
        x,
        y,
    }: {
        x: (index: number) => number;
        y: (value: number) => number;
    }) =>
        tooltipIndex !== null ? (
            <G x={x(tooltipIndex)} key={"tooltip"}>
                <Circle
                    cy={y(data[tooltipIndex])}
                    r={6}
                    stroke="#fff"
                    strokeWidth={2}
                    fill="#f90"
                />
                <SvgText
                    y={y(data[tooltipIndex]) - 10}
                    fontSize="12"
                    fontWeight="bold"
                    fill="#f90"
                    textAnchor="middle"
                >
                    {data[tooltipIndex].toFixed(4)}
                </SvgText>
            </G>
        ) : null;

    const handleTouch = (event: GestureResponderEvent) => {
        const touchX = event.nativeEvent.locationX;
        const index = Math.round((touchX / chartWidth) * (data.length - 1));
        if (index >= 0 && index < data.length) {
            setTooltipIndex(index);
            // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };
    const translateX = useRef(new Animated.Value(0)).current;

    const [selected, setSelected] = useState("Liquidity");
    const moveToggle = (option) => {
        setSelected(option);
        Animated.spring(translateX, {
            toValue: option === "Volume" ? 0 : option === "Liquidity" ? 60 : 120, // Adjust 100 based on button width
            useNativeDriver: true,
        }).start();
    };

    const ethereum = "Etherum";
    const scan = "BscScan";
    const etherDollar = "etherDollar";
    const etherPercent = "etherPercent";

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

    console.log("Token0:", pool.token0.symbol, "Address0:", address0, "URI0:", uri0);
    console.log("Token1:", pool.token1.symbol, "Address1:", address1, "URI1:", uri1);

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
        <View style={styles.container}>
            <FoxIcon style={styles.foxIcon} />
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <View style={styles.chartButton}>
                        <Animated.View
                            style={[styles.slider, { transform: [{ translateX }] }]}
                        />
                        {["Volume", "Liquidity", "Fees"].map((frame, index) => (
                            <TouchableOpacity
                                key={"Token-Chart-" + index}
                                style={styles.option}
                                onPress={() => {
                                    moveToggle(frame);
                                    setSelectedTimeframe(
                                        frame as "Volume" | "Liquidity" | "Fees"
                                    );
                                    setTooltipIndex(null);
                                }}
                            >
                                <Text style={styles.timeframe}>{frame}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Text style={styles.changeColor}>+227.543384 USDC </Text>
                <Text style={styles.changeWhite}>Past 24 Hours</Text>

                <View onTouchStart={handleTouch} style={{ height: 200 }}>
                    <AreaChart
                        style={{ height: 200 }}
                        data={data}
                        contentInset={{ top: 20, bottom: 20 }}
                        curve={shape.curveMonotoneX}
                        svg={{ fill: "url(#gradient)" }}
                    >
                        <Gradient offset={dataOffset} />
                        <VerticalLine />
                    </AreaChart>
                    <LineChart
                        style={StyleSheet.absoluteFill}
                        data={data}
                        curve={shape.curveMonotoneX}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{ stroke: "#fa6d01", strokeWidth: 2 }}
                    >
                        <Tooltip />
                    </LineChart>
                </View>

                <View style={styles.timestamps}>
                    {chartHorizontal[selectedTimeframe].map((item, index) => (
                        <Text
                            style={styles.timestamp}
                            key={"chart-horizontal-" + index}
                        >
                            {item}
                        </Text>
                    ))}
                </View>
            </View>
            <View style={styles.tvlContainer}>
                <Text style={styles.tvlText}>TVL</Text>
                <Text style={styles.tvlValue}>${pool.liquidity?.toFixed(2)}</Text>
                <Text style={styles.tvlPercent}>-8.23%</Text>
                <View style={styles.tvlTokenContainer}>
                    <View style={styles.tvlTokenRow}>
                        <View style={styles.tvlToken}>
                            <View style={styles.tokenIcon}>
                                {isRemoteImage(uri0) ? (
                                    <CustomImage source={{ uri: uri0 }} style={styles.tokenIcon} />
                                ) : (
                                    <Image source={getImageSource(uri0)} style={styles.tokenIcon} />
                                )}
                            </View>
                            <Text style={styles.tokenText}>{pool.token0.symbol}</Text>
                        </View>
                        <Text style={styles.tokenText}>{formatNumber(pool.totalValueLockedToken0)}</Text>
                    </View>
                    <View style={styles.tvlTokenRow}>
                        <View style={styles.tvlToken}>
                            <View style={styles.tokenIcon}>
                                {isRemoteImage(uri1) ? (
                                    <CustomImage source={{ uri: uri1 }} style={styles.tokenIcon} />
                                ) : (
                                    <Image source={getImageSource(uri1)} style={styles.tokenIcon} />
                                )}
                            </View>
                            <Text style={styles.tokenText}>{pool.token1.symbol}</Text>
                        </View>
                        <Text style={styles.tokenText}>{formatNumber(pool.totalValueLockedToken1)}</Text>
                    </View>
                </View>
                <Text style={styles.tvlText}>Volumn 24h</Text>
                <Text style={styles.tvlValue}>${pool.volume?.toFixed(2)}</Text>
                <Text style={styles.volume24hPercent}>+8.23%</Text>
                <Text style={styles.tvlText}>Fee 24H</Text>
                <Text style={styles.tvlValue}>${pool.collectedFees?.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        flex: 1,
        zIndex: 1000,
    },
    header: {
        flexDirection: "column",
    },
    tokenInfo: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
    },
    tokenLogo: {
        width: 24,
        height: 24,
        padding: 4,
        marginLeft: 8,
        borderRadius: 40,
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    tokenName: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 14,
        color: "#FFFFFF",
    },
    tokenScan: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#FA5401",
    },
    tokenValue: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        left: "20%",
        gap: 8,
    },
    tokenDollar: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#FFFFFF",
    },
    tokenPercent: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#1AEFAF",
    },
    rightButton: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 4,
        paddingVertical: 12,
    },
    addLiquidity: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 28,
        width: 120,
        height: 44,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#FA5401",
    },
    addLiquidityText: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#FA5401",
    },
    addTrade: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 28,
        width: 85,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#FA5401",
    },
    addTradeText: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#FFFFFF",
    },
    scrollContainer: {
        flex: 1,
    },
    foxIcon: {
        // position: "absolute",
        // height: 24,
        // top: -24,
        left: "20%",
        right: "80%",
    },
    chartContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#404040",
        backgroundColor: "rgba(34, 34, 34, 0.7)",
    },
    chartHeader: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    chartButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 190,
        height: 40,
        right: 0,
        marginBottom: 8,
        padding: 4,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    slider: {
        position: "absolute",
        width: 60,
        height: 30,
        borderRadius: 12,
        margin: 4,
        backgroundColor: "#FA5001",
    },
    option: {
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        zIndex: 1,
    },
    timeframe: {
        width: 73,
        height: 32,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: -5,
        borderRadius: 12,
        textAlign: "center",
        textAlignVertical: "center",
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 10,
        color: "#FFFFFF",
    },
    pair: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 8,
        alignItems: "center",
    },
    pairFirst: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    pairSecond: {
        color: "#FA5001",
        fontWeight: "bold",
        fontSize: 16,
    },
    price: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    changeColor: {
        fontSize: 12,
        color: "#FA5001",
    },
    changeWhite: {
        fontSize: 12,
        color: "#ffffff",
        marginBottom: 20,
    },
    timestamps: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    timestamp: {
        color: "#aaa",
        fontSize: 10,
    },
    tvlContainer: {
        flex: 1,
        flexDirection: "column",
        gap: 4,
        padding: 32,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 8,
        borderColor: "#404040",
        backgroundColor: "rgba(34, 34, 34, 0.7)",
    },
    tvlText: {
        marginTop: 8,
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: 12,
        color: "#FFFFFF",
    },
    tvlValue: {
        fontFamily: "Poppins",
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 24,
        color: "#FFFFFF",
    },
    tvlPercent: {
        fontFamily: "Poppins",
        fontSize: 10,
        color: "#FF5A5D",
    },
    volume24hPercent: {
        fontFamily: "Poppins",
        fontSize: 10,
        color: "#1AEFAF",
    },
    tvlTokenContainer: {
        // justifyContent: "center",
        flexDirection: "column",
        gap: 23,
        alignItems: "center",
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 21,
        padding: 16,
    },
    tvlTokenRow: {
        width: '100%',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tvlToken: {
        flexDirection: "row",
        alignItems: "center",
    },
    tokenText: {
        fontSize: 22,
        color: "#FFFFFF",
        marginLeft: 4,
    },
    tokenIcon: {
        width: 43,
        height: 43,
    },
});

export default TokenPairDetail;
