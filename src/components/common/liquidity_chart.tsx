import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type Props = {
  liquidityData: Array<{
    timestamp: number;
    liquidity: number;
  }>;
};

const LiquidityChart = ({ liquidityData }: Props) => {
  const data = {
    labels: liquidityData.map(item => new Date(item.timestamp * 1000).toLocaleTimeString()),
    datasets: [
      {
        data: liquidityData.map(item => item.liquidity),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#000000',
          backgroundGradientFrom: '#000000',
          backgroundGradientTo: '#000000',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(243, 186, 47, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default LiquidityChart;