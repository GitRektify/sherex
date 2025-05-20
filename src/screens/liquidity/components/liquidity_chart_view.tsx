import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

type RouteParams = {
  LiquidityChartView: {
    id: string;
  };
};

const LiquidityChartView = () => {
  const route = useRoute<RouteProp<RouteParams, 'LiquidityChartView'>>();
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Liquidity Pool Chart - ID: {id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default LiquidityChartView; 