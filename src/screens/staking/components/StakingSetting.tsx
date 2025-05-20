import React from 'react';
import {View, StyleSheet} from 'react-native';
import ChartSwapHeader from '../../swap/components/ChartSwapHeader';

const StakingSetting = ({info, setInfo, liquiditySlippage, handleSetting}) => {
  return (
    <ChartSwapHeader
      isSetting={false} // truyền giá trị boolean thay vì chuỗi
      info={info}
      setInfo={setInfo}
      liquiditySlippage={liquiditySlippage}
      handleSetting={handleSetting}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(243, 186, 47, 0.4)',
    backgroundColor: 'transparent',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  title: {
    fontSize: 21,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  settingsContainer: {
    flexDirection: 'row',
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
  },
  swapContainer: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 8,
  },
  tokenSection: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tokenLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  maxButton: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountInput: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '400',
    width: '70%',
    padding: 0,
  },
  amountDisplay: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  tokenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tokenIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  tokenSymbol: {
    fontSize: 18,
    color: '#FFFFFF',
    marginHorizontal: 8,
    fontWeight: '400',
  },
  arrowIcon: {
    width: 8,
    height: 8,
    tintColor: '#FFFFFF',
  },
  balanceRow: {
    flexDirection: 'row',
    marginRight: 16,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
    marginRight: 16,
  },
  balanceAmount: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  swapButton: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    zIndex: 1,
    backgroundColor: '#000000',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slippageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  slippageLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  slippageValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  enterButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
});

export default StakingSetting;
