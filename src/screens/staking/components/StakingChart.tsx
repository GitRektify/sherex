import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { LineChart } from 'react-native-chart-kit';

import ArrowDownIcon from "@/assets/svg/arrow-down.svg";

const StakingChart = ({ info, swaps }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showDropdown, setShowDropdown] = useState(false);

  const timeframes = [
    { label: '24h', value: '24h' },
    { label: '1w', value: '1w' },
    { label: '1M', value: '1M' },
  ];

  const processedData = useMemo(() => {
    if (!swaps || swaps.length === 0) {
      return {
        labels: [],
        datasets: [{
          data: [],
          color: (opacity = 1) => `rgba(243, 186, 47, ${opacity})`,
          strokeWidth: 2,
        }],
      };
    }

    // Lọc và xử lý dữ liệu theo timeframe
    const now = new Date().getTime();
    const filteredSwaps = swaps.filter(swap => {
      const swapTime = swap.timestamp * 1000;
      if (selectedTimeframe === '24h') {
        return now - swapTime <= 24 * 60 * 60 * 1000;
      } else if (selectedTimeframe === '1w') {
        return now - swapTime <= 7 * 24 * 60 * 60 * 1000;
      } else {
        return now - swapTime <= 30 * 24 * 60 * 60 * 1000;
      }
    });

    // Đảm bảo có ít nhất 2 điểm dữ liệu
    if (filteredSwaps.length < 2) {
      return {
        labels: ['', ''],
        datasets: [{
          data: [0, 0],
          color: (opacity = 1) => `rgba(243, 186, 47, ${opacity})`,
          strokeWidth: 2,
        }],
      };
    }

    // Format labels theo timeframe
    const labels = filteredSwaps.map(swap => {
      const date = new Date(swap.timestamp * 1000);
      if (selectedTimeframe === '24h') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    });

    // Đảm bảo giá trị price là số hợp lệ
    const data = filteredSwaps.map(swap => {
      const price = parseFloat(swap.price);
      return isNaN(price) ? 0 : price;
    });

    return {
      labels,
      datasets: [{
        data,
        color: (opacity = 1) => `rgba(243, 186, 47, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  }, [swaps, selectedTimeframe]);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#F3BA2F',
    },
    formatYLabel: (value) => parseFloat(value).toFixed(2),
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tokenPair}>
          <Text style={styles.tokenName}>{info?.token0?.symbol || ''}</Text>
          <Text style={styles.separator}>/</Text>
          <Text style={[styles.tokenName, styles.secondaryToken]}>{info?.token1?.symbol || ''}</Text>
          <TouchableOpacity style={styles.switchButton}>
            <Image
              source={require('../../../../assets/icon/arrow-exchange-swap.svg')}
              style={styles.switchIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Timeframe Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(true)}
          >
            <Text style={styles.dropdownButtonText}>{selectedTimeframe}</Text>
            <ArrowDownIcon
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>

          <Modal
            visible={showDropdown}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDropdown(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDropdown(false)}
            >
              <View style={styles.dropdownMenu}>
                {timeframes.map((tf, index) => (
                  <TouchableOpacity
                    key={'staking-chart-3-'+index}
                    style={[
                      styles.dropdownItem,
                      selectedTimeframe === tf.value && styles.selectedDropdownItem,
                    ]}
                    onPress={() => {
                      setSelectedTimeframe(tf.value);
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedTimeframe === tf.value && styles.selectedDropdownItemText,
                      ]}
                    >
                      {tf.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={processedData}
          width={Dimensions.get('window').width - 80}
          height={350}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(243, 186, 47, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tokenPair: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  separator: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 4,
  },
  secondaryToken: {
    opacity: 0.4,
  },
  switchButton: {
    marginLeft: 8,
    padding: 4,
  },
  switchIcon: {
    width: 12,
    height: 12,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    minWidth: 100,
  },
  dropdownButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
  },
  dropdownIcon: {
    width: 12,
    height: 12,
    tintColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 40,
  },
  dropdownMenu: {
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 8,
    padding: 4,
    minWidth: 100,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(243, 186, 47, 0.2)',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedDropdownItemText: {
    color: '#F3BA2F',
  },
  chartContainer: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default StakingChart;
