import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { parseUnits } from 'ethers';
import { LinearGradient } from 'react-native-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Warnning from '@/assets/svg/outline.svg';
// import * as Clipboard from 'expo-clipboard';

import { useStakingPool } from '@/hooks/useActions';
import SettingModal from '@/components/modal/SettingModal';
import { RootState } from '@/stores/index';
import EditableStakingAPY from '@/components/modal/EditableStakingAPY';
import EditableStakingLockPeriod from '@/components/modal/EditableStakingLockPeriod';
import GetStakingModal from '@/components/modal/GetStakingModal';
import StakingTable from './StakingTable';
import { Container, FontWeight, FullScreenImage } from '@/components/general/shared_styled';
import { getDecimals } from '@/utils/contract';
import LoadingScreen from '@/components/common/Loader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Staking = () => {
  const { t } = useTranslation();
  const [isSettingModal, setIsSettingModal] = useState(false);
  const [apyOptions, setApyOptions] = useState([30, 100, 230, 400]);
  const [periodOptions, setPeriodOptions] = useState([30, 100, 230, 400]);
  const [tokenAddress, setTokenAddress] = useState('');
  const [poolAmount, setPoolAmount] = useState('');
  const { createStakingPool } = useStakingPool(tokenAddress);
  const [isStakingModal, setIsStakingModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const dispatch = useDispatch();

  const { tokens, loading: tokensLoading } = useSelector((state: RootState) => state.tokens);
  const { stakingPools } = useSelector((state: RootState) => state.staking);

  const handleOpenStakingModal = (pool) => {
    if (pool) {
      setSelectedPool(pool);
      setIsStakingModal(true);
    }
  };

  const handleCloseStakingModal = () => {
    setIsStakingModal(false);
    setSelectedPool(null);
  };

  const handleCreateStakingPool = async () => {
    if (tokenAddress === '' || poolAmount === '') return;
    try {
      const decimals = await getDecimals(tokenAddress);
      const amount = parseUnits(poolAmount, decimals);
      await createStakingPool(amount, apyOptions, periodOptions);
    } catch (err) {
      console.error(err);
    }
  };
  // const handleCopy = () => {
  //   Clipboard.setStringAsync(tokenAddress);
  // };
  const handleCopy = () => {

  };


  return (
    <Container>
      <FullScreenImage
        source={require('../../../../assets/image/background.png')}
      />
      <ScrollView style={styles.scrollView}>
        <View
          style={styles.container}
        >
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t('staking.title')}</Text>
              <Text style={styles.subtitle}>{t('staking.subTitle')}</Text>
            </View>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setIsSettingModal(true)}
            >
              <LinearGradient
                colors={['#FA5001', '#FA5001']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>{t('staking.createStake')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <SettingModal
            isVisible={isSettingModal}
            onClose={() => setIsSettingModal(false)}
            title={t('createStakingModal.title')}
          >
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder={t('createStakingModal.TokenAddress')}
                placeholderTextColor="#FFFFFF"
                value={tokenAddress}
                onChangeText={setTokenAddress}
              />
              <TouchableOpacity style={styles.copyIcon} onPress={handleCopy}>
                <Feather name="copy" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder={t('createStakingModal.enterPool')}
                placeholderTextColor="#FFFFFF"
                keyboardType="numeric"
                value={poolAmount}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setPoolAmount(numericText);
                }}
              />
              <TouchableOpacity style={styles.copyIcon}>
                <Warnning width={18} height={18} />
              </TouchableOpacity>
            </View>
            <EditableStakingAPY title={t('createStakingModal.apy')} onChange={setApyOptions} options={apyOptions} />
            <EditableStakingLockPeriod
              title={t('createStakingModal.lockPeriodInDays')}
              onChange={setPeriodOptions}
              options={periodOptions}
            />
            <TouchableOpacity onPress={handleCreateStakingPool}>
              <LinearGradient
                colors={['#FA5001', '#FA5001']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>{t('createStakingModal.create')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </SettingModal>

          {tokensLoading ? (
            <View style={styles.loaderContainer}>
              {/* <ActivityIndicator size="large" color="#F3BA2F" /> */}
              <LoadingScreen/>
            </View>
          ) : stakingPools && stakingPools.length > 0 ? (
            <View style={styles.poolsContainer}>
              {stakingPools.map((pool) => (
                <StakingTable key={pool.id} pool={pool} onStake={() => handleOpenStakingModal(pool)} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('staking.noPoolsAvailable')}</Text>
            </View>
          )}

          {/* <GetStakingModal isOpen={isStakingModal} onClose={handleCloseStakingModal} pool={selectedPool} /> */}
        </View>
      </ScrollView>
    </Container>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginTop: 120,
  },
  container: {
    minHeight: '100%',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: "Poppins",
    fontStyle: "normal",
    color: '#FA5401',
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '400',
  },
  createButton: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    elevation: 5,
  },
  gradientButton: {
    borderRadius: 9,
    width: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'rgba(34, 34, 34, 1)',
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#404040',
    backgroundColor: '#282828',
    color: '#fff',
    padding: 12,
    paddingLeft: 16,
    marginBottom: 10,
    borderRadius: 12,
    fontSize: 12,
  },
  copyIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  poolsContainer: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(243,186,47,0.2)',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
});

export default Staking;