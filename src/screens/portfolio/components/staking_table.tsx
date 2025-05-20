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
    <LinearGradient
      colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']}
      style={styles.container}
    >
      <View style={styles.content}>
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
              <Text style={styles.statLabel}>Pending reward</Text>
              <Text style={styles.statValue}>{pool.rewards} $SHRX</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Staked</Text>
              <Text style={styles.statValue}>{pool.staked} $SHRX</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>APR</Text>
              <Text style={styles.statValue}>{pool.apy}%</Text>
            </View>

            <View style={styles.statsColumn}>
              <Text style={styles.statLabel}>Liquidity</Text>
              <Text style={styles.statValue}>${pool.liquidity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.lockInfo}>
          <View style={styles.lockRow}>
            <Text style={styles.lockLabel}>Total Locked:</Text>
            <Text style={styles.lockValue}>${pool.liquidity}</Text>
          </View>
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
              colors={['#CF7D33', '#F3BA2F']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Get $SHRX now!</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statsGrid: {
    flex: 1,
  },
  statsColumn: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(156, 163, 175, 1)',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 24,
  },
  lockInfo: {
    marginBottom: 24,
  },
  lockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  lockLabel: {
    fontSize: 16,
    color: 'rgba(156, 163, 175, 1)',
  },
  lockValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  stakePrompt: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    color: 'rgba(156, 163, 175, 1)',
    marginBottom: 16,
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
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StakingTable;
