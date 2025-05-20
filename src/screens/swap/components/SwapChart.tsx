import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, GestureResponderEvent } from 'react-native';
import { Defs, LinearGradient, Stop, Circle, G, Line, Text as SvgText } from 'react-native-svg';
import { LineChart, AreaChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
// import * as Haptics from 'expo-haptics';

import FoxIcon from '@/assets/svg/fox-sit.svg'
import ExchangeIcon from '@/assets/svg/arrow-exchange-swap.svg'

const chartData = {
    '24H': [0.92, 0.89, 0.93, 0.91, 0.95, 0.97, 0.96, 0.99, 1.0, 0.98, 0.97, 1.01, 1.00, 0.99, 1.0005],
    '1W': [0.85, 0.88, 0.86, 0.89, 0.91, 0.94, 0.96, 0.99, 0.98, 0.97, 0.95, 0.93, 0.91],
    '1M': [0.75, 0.78, 0.80, 0.83, 0.86, 0.89, 0.92, 0.95, 0.97, 1.0, 0.98, 0.95, 0.92],
};

const chartTitle = {
    '24H': '24 Hours',
    '1W': '1 Week',
    '1M': '1 Month',
};

const chartLineNumber = {
    '24H': 24,
    '1W': 7,
    '1M': 30,
};

const chartHorizontal = {
    '24H': [0, 4, 8, 12, 16, 20, 24],
    '1W': [0, 1, 2, 3, 4, 5, 6, 7],
    '1M': [0, 5, 10, 15, 20, 25, 30],
};

const SwapChart = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState<'24H' | '1W' | '1M'>('24H');
    const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
    const data = chartData[selectedTimeframe];
    const dataOffset = Math.max(...data) - Math.min(...data)
    const screenWidth = Dimensions.get('window').width;
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
        const verticalLines = []
        const lineNumber = chartLineNumber[selectedTimeframe]
        for (let i = 0; i <= lineNumber; i++) {
            verticalLines.push(
                <Line
                    key={'swap-chart-vertical-line-' + i}
                    x1={i * 100 / lineNumber + '%'}
                    x2={i * 100 / lineNumber + '%'}
                    y1={'0%'}
                    y2={'100%'}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth={1}
                // strokeDasharray={[4, 4]}
                />
            )
        }

        return <View>{verticalLines}</View>
    }

    const Tooltip = ({ x, y }: { x: (index: number) => number; y: (value: number) => number }) =>
        tooltipIndex !== null ? (
            <G x={x(tooltipIndex)} key={'tooltip'}>
                <Circle cy={y(data[tooltipIndex])} r={6} stroke="#fff" strokeWidth={2} fill="#f90" />
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

    return (
        <View style={styles.container}>
            <FoxIcon style={styles.fox} />
            <View style={styles.chatContainer}>
                <View style={styles.header}>
                    <View style={styles.pair}>
                        <Text>
                            <Text style={styles.pairFirst}>ETH/</Text>
                            <Text style={styles.pairSecond}>BNB</Text>
                        </Text>
                        <ExchangeIcon width={24} height={24} color={'white'} />
                    </View>
                    <View style={styles.timeframeTabs}>
                        {['24H', '1W', '1M'].map((frame, index) => (
                            <TouchableOpacity key={'swap-chart-frame-' + index}
                                onPress={() => {
                                    setSelectedTimeframe(frame as '24H' | '1W' | '1M');
                                    setTooltipIndex(null);
                                }}
                            >
                                <Text style={[styles.timeframe, selectedTimeframe === frame && styles.activeTimeframe]}>
                                    {frame}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <Text style={styles.price}>1.0005 BN</Text>
                <Text style={styles.change}>
                    <Text style={styles.changeColor}>+227.543384 USDC </Text>
                    <Text style={styles.changeWhite}>Past {chartTitle[selectedTimeframe]}</Text>
                </Text>

                <View onTouchStart={handleTouch} style={{ height: 200 }}>
                    <AreaChart
                        style={{ height: 200 }}
                        data={data}
                        contentInset={{ top: 20, bottom: 20 }}
                        curve={shape.curveMonotoneX}
                        svg={{ fill: 'url(#gradient)' }}
                    >
                        <Gradient offset={dataOffset} />
                        <VerticalLine />
                    </AreaChart>
                    <LineChart
                        style={StyleSheet.absoluteFill}
                        data={data}
                        curve={shape.curveMonotoneX}
                        contentInset={{ top: 20, bottom: 20 }}
                        svg={{ stroke: '#fa6d01', strokeWidth: 2 }}
                    >
                        <Tooltip />
                    </LineChart>
                </View>

                <View style={styles.timestamps}>
                    {chartHorizontal[selectedTimeframe].map((item, index) =>
                        <Text style={styles.timestamp} key={'swap-chart-horizontal-' + index}>{item}</Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10,
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: '600',
    },
    fox: {
        // Use percentage-based positioning (strings!)
        left: '20%',
        right: '80%',
        top: '0%',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#404040',
        backgroundColor: 'rgba(34, 34, 34, 0.7)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    pair: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        alignItems: 'center',
    },
    pairFirst: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    pairSecond: {
        color: '#FA5001',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timeframeTabs: {
        // Layout
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        // Background and border
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 15,
    },
    timeframe: {
        color: '#ffffff',
    },
    activeTimeframe: {
        paddingHorizontal: 8,
        backgroundColor: '#FA5001',
        borderRadius: 12,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    change: {
        marginBottom: 10,
    },
    changeColor: {
        fontSize: 12,
        color: '#FA5001',
        marginBottom: 10,
    },
    changeWhite: {
        fontSize: 12,
        color: '#ffffff',
        marginBottom: 10,
    },
    timestamps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    timestamp: {
        color: '#aaa',
        fontSize: 10,
    },
});

export default SwapChart;
