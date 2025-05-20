import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

type Pool = {
  id: string;
  token0: {
    symbol: string;
    id: string;
  };
  token1: {
    symbol: string;
    id: string;
  };
  liquidity: number;
  volume24h: number;
  fees24h: number;
  apr: string;
  token0Price: string;
  token1Price: string;
};

type Props = {
  pool: Pool;
};

const LiquidityViewDetail = ({ pool }: Props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("chartButtons.poolInfo")}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t("chartButtons.liquidity")}</Text>
          <Text style={styles.value}>${pool.liquidity?.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t("chartButtons.volume24h")}</Text>
          <Text style={styles.value}>${pool.volume24h?.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t("chartButtons.fees24h")}</Text>
          <Text style={styles.value}>${pool.fees24h?.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>{t("chartButtons.apr")}</Text>
          <Text style={styles.value}>{pool.apr}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 16,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LiquidityViewDetail; 