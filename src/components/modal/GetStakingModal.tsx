import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { parseUnits } from 'ethers';
import { useStaking } from '@/hooks/useActions';
import SettingModal from './SettingModal';
import SlippageSelectorSwap from './SlippageSelectorSwap';

const calculateReturns = (apy, stakeAmount) => {
  const amount = parseFloat(stakeAmount) || 0;
  const rate = parseFloat(apy) || 0;
  const days = Math.floor((rate / 100) * 365);
  const annualReturn = amount * (rate / 100);
  const estimatedReturn = amount + annualReturn;
  return {
    days,
    estimatedReturn: estimatedReturn.toFixed(2)
  };
};

const GetStakingModal = ({ isOpen, onClose, pool }) => {
  const { t } = useTranslation();
  const [swapSlippage, setSwapSlippage] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const { stake: stakeToPool } = useStaking(pool.poolAddress, pool.stakingToken);

  // Chỉ tính toán nếu pool tồn tại
  const { days, estimatedReturn } = pool
    ? calculateReturns(Number(swapSlippage), stakeAmount)
    : { days: 0, estimatedReturn: '0.00' };

  const formatCurrency = (amount) => {
    const value = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleStake = async () => {
    if (!stakeAmount || swapSlippage === 0) {
      return;
    }
    const apyIndex = pool.apys.findIndex(apy => apy === swapSlippage);
    const amount = parseUnits(stakeAmount, 18);
    await stakeToPool(amount, apyIndex);
  };

  return (
    <SettingModal
      isVisible={isOpen}
      onClose={onClose}
      title=""
      isSmall={false}
    >
      {pool && (
        <>
            <Text style={styles.sectionTitle}>{t("staking.returns")}</Text>
            <SlippageSelectorSwap
              title=""
              value={swapSlippage}
              onChange={setSwapSlippage}
              options={pool.apys}
            />
            <View style={styles.row}>
              <Text style={styles.label}>
                {t("getStakingModal.looking")} {days} {t("getStakingModal.day")}
              </Text>
              <Text style={styles.label}>
                {t("getStakingModal.estimatedReturn")} {estimatedReturn} USDT
              </Text>
            </View>
          <View style={[styles.section, { marginTop: 24 }]}>
            <View style={styles.row}>
              <Text style={styles.label}>{t("getStakingModal.stakeAmount")}</Text>
              <Text style={styles.label}>{t("getStakingModal.max")}: 0</Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#fff"
                keyboardType="numeric"
                value={stakeAmount}
                onChangeText={setStakeAmount}
              />
              <Text style={styles.currencyText}>-${formatCurrency(stakeAmount)}</Text>
            </View>
          </View>
            <TouchableOpacity style={styles.button} onPress={handleStake}>
              <Text style={styles.buttonText}>{t("getStakingModal.stake")}</Text>
            </TouchableOpacity>
        </>
      )}
    </SettingModal>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#FA5001',
    fontSize: 32,
    fontWeight: '600',
    fontStyle: 'normal',
    marginBottom: 12,
  },
  section: {
    width: '100%',
    backgroundColor: '#282828',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#404040',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  label: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontSize: 14,
  },
  inputContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    color: '#fff',
    fontSize: 48,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  currencyText: {
    color: '#717171',
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  button: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FA5001',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

export default GetStakingModal;
