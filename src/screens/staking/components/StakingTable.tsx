import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {LinearGradient} from 'react-native-linear-gradient';

import { getTokenLogo } from '@/utils/index';
import { SHRX_TOKEN } from '@/utils/constants';
import { CustomImage } from '@/components/general/shared_styled';

const StakingTable = ({ pool, onStake }) => {
  const { t } = useTranslation();

  const uri = pool.rewardToken === SHRX_TOKEN.address
    ? 'sherex'
    : getTokenLogo(pool.rewardToken);

  const getImageSource = (uri) => {
    if (uri.startsWith('http') || uri.startsWith('https')) {
      return { uri };
    } else {
      if (uri.includes('sherex')) {
        return require('@/assets/image/sherex.png');
      }
    }
  };

  const isRemoteImage = uri.startsWith('http') || uri.startsWith('https');

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {isRemoteImage ? (
              <CustomImage source={{ uri }} style={styles.avatar} />
            ) : (
              <Image source={getImageSource(uri)} style={styles.avatar} />
            )}
            <Text style={styles.title}>${pool.rewardTokenSymbol}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Pending rewards</Text>
              <Text style={styles.statValue}>{pool.rewards} $SHRX</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>APR</Text>
              <Text style={styles.statValue}>{pool.apy}%</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Staked</Text>
              <Text style={styles.statValue}>{pool.staked} $SHRX</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Liquidity</Text>
              <Text style={styles.statValue}>${pool.liquidity}</Text>
            </View>
          </View>
        </View>
        </View>
        <View style={styles.container}>
        <View style={styles.lockInfo}>
          <View style={styles.lockRow}>
            <Text style={styles.lockLabel}>Total locked:</Text>
            <Text style={styles.lockValue}>${pool.liquidity}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.lockRow}>
            <Text style={styles.lockLabel}>Average lock duration:</Text>
            <Text style={styles.lockValue}>{pool.lockPeriod} days</Text>
          </View>
        </View>

        <View style={styles.stakePrompt}>
          <Text style={styles.promptText}>
            {t("staking.stakeAndLock")}
          </Text>
          <TouchableOpacity onPress={onStake} style={styles.buttonContainer}>
            <LinearGradient
              colors={['#FA5401', '#FA5401']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Get $SHRX now!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
    backgroundColor: 'rgba(34, 34, 34, 0.7)',
    // overflow: 'hidden',
  },
  content: {
    padding: 20,
    borderRadius: 12,
  },
  header: {
    justifyContent: 'space-between',
    paddingBottom: 12,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 15,
    marginBottom: 10,
    flex: 1,
  },
  avatar: {
    width: 67,
    height: 67,
    borderRadius: 16,
    marginRight: 8,
  },
  title: {
    alignItems: 'center',
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 10,
  },
  statsGrid: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  statsColumn: {
    alignItems: 'center',
  },
  statLabel: {
    alignItems: 'center',
    fontSize: 10,
    color: '#FA5401',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  lockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 30,
  },
  lockRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lockLabel: {
    fontSize: 12,
    color: '#FA5401',
  },
  lockValue: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  stakePrompt: {
    backgroundColor: 'rgba(34, 34, 34)',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  gradientButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
});

export default StakingTable;
