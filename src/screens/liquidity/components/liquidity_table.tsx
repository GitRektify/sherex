import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { MainNavigationProp, MainScreens } from '@/navigators/MainStackNavigator'
import { getTokenLogo } from '@/utils/index';
import { SHRX_TOKEN } from '@/utils/constants';
import LiquidityTableHeader from './liquidity_table_header';
import { CustomImage } from '@/components/general/shared_styled';

type Pool = {
  id: string;
  token0: string;
  token1: string;
  feeTier: number;
  liquidity: number;
  volume24h: number;
  fees24h: number;
  apr: string;
};

type Props = {
  pools: Pool[];
};

const LiquidityTable = ({ pools }: Props) => {
  const { t } = useTranslation();
  const navigation = useNavigation<MainNavigationProp<MainScreens.liquidity>>();

  const handleNavigateToView = (poolId: string) => {
    console.log("[Navigation] Attempting to navigate to LiquidityView with poolId:", poolId);
    try {
      navigation.navigate(MainScreens.liquidityView, { id: poolId });
      console.log("[Navigation] Successfully navigated to LiquidityView");
    } catch (error) {
      console.error("[Navigation] Error navigating to LiquidityView:", error);
    }
  };

  const handleNavigateToChart = (poolId: string) => {
    console.log("[Navigation] Attempting to navigate to LiquidityChartView with poolId:", poolId);
    try {
      navigation.navigate(MainScreens.liquidityChartView, { id: poolId });
      console.log("[Navigation] Successfully navigated to LiquidityChartView");
    } catch (error) {
      console.error("[Navigation] Error navigating to LiquidityChartView:", error);
    }
  };

  const renderPoolRow = (pool: Pool, index) => {
    const address0 = pool.token0.toLowerCase() === 'shrx'
      ? SHRX_TOKEN.address
      : pool.token0;

    const address1 = pool.token1.toLowerCase() === 'shrx'
      ? SHRX_TOKEN.address
      : pool.token1;

    const uri0 = pool.token0.toLowerCase() === 'shrx'
      ? 'sherex'
      : getTokenLogo(address0);

    const uri1 = pool.token1.toLowerCase() === 'shrx'
      ? 'sherex'
      : getTokenLogo(address1);

    const getImageSource = (uri: string) => {
      if (uri.startsWith('http') || uri.startsWith('https')) {
        return { uri };
      } else {
        if (uri.includes('sherex')) {
          return require('@/assets/image/sherex.png');
        }
      }
    };

    const isRemoteImage = (uri: string) => uri.startsWith('http') || uri.startsWith('https');

    return (
      <TouchableOpacity
        key={'pool-id-2-'+index}
        style={styles.row}
        onPress={() => handleNavigateToView(pool.id)}
      >
        <View style={styles.pairInfo}>
          <View style={styles.tokenIcons}>
            {isRemoteImage(uri0) ? (
              <CustomImage source={{ uri: uri0 }} style={styles.tokenIcon} />
            ) : (
              <Image source={getImageSource(uri0)} style={styles.tokenIcon} />
            )}
            {isRemoteImage(uri1) ? (
              <CustomImage source={{ uri: uri1 }} style={[styles.tokenIcon, styles.secondToken]} />
            ) : (
              <Image source={getImageSource(uri1)} style={[styles.tokenIcon, styles.secondToken]} />
            )}
          </View>
          <Text style={styles.pairText}>{pool.token0}/{pool.token1}</Text>
        </View>
        <Text style={styles.valueText}>{(pool.feeTier / 10000).toFixed(2)}%</Text>
        <Text style={styles.valueText}>${pool.liquidity?.toFixed(2)}</Text>
        <Text style={styles.valueText}>${pool.volume24h?.toFixed(2)}</Text>
        <Text style={styles.valueText}>${pool.fees24h?.toFixed(2)}</Text>
        <View style={styles.aprColumn}>
          <Text style={styles.valueText}>{pool.apr}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '56.34%' }]} />
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => handleNavigateToChart(pool.id)}
          >
            <CustomImage source={require('../../../../assets/icon/btn.svg')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LiquidityTableHeader />
      <View style={styles.headerRow}>
        <View style={styles.columnLeft}>
          <Text style={styles.headerText}>{t("liquidityTable.pool")}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>{t("liquidityTable.feeTier")}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>{t("liquidityTable.liquidity")}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>{t("liquidityTable.volume")}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>{t("liquidityTable.fee")}</Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.headerText}>{t("liquidityTable.apr")}</Text>
        </View>
        <View style={styles.columnRight}>
          <Text style={styles.headerText}>{t("liquidityTable.actions")}</Text>
        </View>
      </View>
      {pools?.map(renderPoolRow)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(243,186,47,0.4)',
    // Nếu muốn backdrop blur, có thể tích hợp expo-blur
    backgroundColor: 'rgba(255,255,255,0.3)', // Phác họa gradient background
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
  },
  columnLeft: {
    flex: 1.5,
    alignItems: 'flex-start',
  },
  column: {
    flex: 1,
    alignItems: 'flex-end',
  },
  columnRight: {
    width: 80,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
  },
  pairInfo: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  tokenIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  secondToken: {
    marginLeft: -12,
  },
  pairText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  valueText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
  },
  aprColumn: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F3BA2F',
    borderRadius: 2,
  },
  actionButtons: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default LiquidityTable;
