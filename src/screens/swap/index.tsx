import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '@/stores/index';
import { FullScreenImage } from '@/components/general/shared_styled';
import SwapAction from './components/SwapAction';
import SwapChart from './components/SwapChart';
import LoadingScreen from '@/components/common/Loader';

const Swap = () => {
  const { swaps, loading: swapsLoading } = useSelector((state: RootState) => state.swaps);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!swapsLoading) {
        setShowLoader(false);
      }
    }, 1500);

    if (!swapsLoading) {
      // If loading is done before 2s, still wait until delay finishes
      delay;
    }

    return () => clearTimeout(delay);
  }, [swapsLoading]);

  return (
    <View style={styles.wrapper}>
      <FullScreenImage source={require('@/assets/image/background.png')} />
      {swapsLoading || showLoader ? (
        <View style={styles.loaderContainer}>
          <LoadingScreen />
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <SwapChart />
          <SwapAction />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    marginTop: 120,
    flex: 1,
  },
});

export default Swap;
