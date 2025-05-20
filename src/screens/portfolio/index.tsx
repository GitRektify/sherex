import React, {useState, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {useTranslation} from 'react-i18next';
import {LinearGradient} from 'react-native-linear-gradient';
import {CustomImage, FullScreenImage} from '@/components/general/shared_styled';
import {getTokenLogo} from '../../utils';
import {SHRX_TOKEN} from '@/utils/constants';
import {staticTokens} from '@/utils/constants';
import {useNavigation} from '@react-navigation/native';
// import { MainNavigationProp, MainScreens } from '@/navigators/MainStackNavigator';
import UsdcIcon from '@/assets/svg/token/USDC.svg';
import BnbIcon from '@/assets/svg/token/BNB.svg';
import {ScrollView} from 'react-native-gesture-handler';
import {ScrollViewContainer} from '../../components/general/shared_styled';

const Portfolio = () => {
  const [selectedAdd, setSelectedAdd] = useState(null);

  const {t} = useTranslation();
  // const navigation = useNavigation<MainNavigationProp<MainScreens.addLiquidity>>();

  const pools = [
    {id: 'usdc-wbnb', token0: 'USDC', token1: 'WBNB', apr: '0.01399'},
    {id: 'shrx-usdt', token0: 'SHRX', token1: 'USDT', apr: '0.00000'},
    {id: 'shrx-usdt-2', token0: 'SHRX', token1: 'USDT', apr: '0'},
    {id: 'usdt-wbnb', token0: 'USDT', token1: 'WBNB', apr: '0.00142'},
    {id: 'dai-wbnb', token0: 'DAI', token1: 'WBNB', apr: '0.01448'},
    {id: 'cake-wbnb', token0: 'Cake', token1: 'WBNB', apr: '0.01479'},
    {id: 'usdt-wbnb-2', token0: 'USDT', token1: 'WBNB', apr: '0'},
    {id: 'cake-wbnb-2', token0: 'Cake', token1: 'WBNB', apr: '0'},
  ];

  const [selected, setSelected] = useState('Liquidity');
  const translateX = useRef(new Animated.Value(0)).current;

  const moveToggle = option => {
    setSelected(option);
    Animated.spring(translateX, {
      toValue: option === 'Liquidity' ? 0 : 74, // Adjust 100 based on button width
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <FullScreenImage source={require('@/assets/image/background.png')} />
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Portfolio</Text>
        </View>
      </View>
      
        <View style={styles.overview}>
          <LinearGradient
            colors={['rgba(34, 34, 34, 0.6)', 'rgba(34, 34, 34, 0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.contentContainer}>
            <Text style={styles.subTitle}>Overview</Text>

            <View style={styles.overviewInfo}>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>
                  Total $SHRX{'\n'}Earned by Pool
                </Text>
                <Text style={styles.overviewValue}>$0</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>
                  Total Staked $SHRX{'\n'}in the staking
                </Text>
                <Text style={styles.overviewValue}>$0</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.myPosition}>
          <LinearGradient
            colors={['rgba(34, 34, 34, 0.6)', 'rgba(34, 34, 34, 0.8)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.contentContainer}>
            <View style={myPosition.header}>
              <Text style={styles.subTitle}>My Position</Text>
              <View style={myPosition.container}>
                <View style={myPosition.toggleWrapper}>
                  <Animated.View
                    style={[myPosition.slider, {transform: [{translateX}]}]}
                  />
                  <TouchableOpacity
                    style={myPosition.option}
                    onPress={() => moveToggle('Liquidity')}>
                    <Text style={myPosition.text}>Liquidity</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={myPosition.option}
                    onPress={() => moveToggle('Staking')}>
                    <Text style={myPosition.text}>Staking</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={myPosition.contentWrapper}>
              <View style={myPosition.positionRow}>
                <View style={[myPosition.positionItem, {left: '15%'}]}>
                  <View style={myPosition.iconRow}>
                    <View style={myPosition.icon_1}>
                      <BnbIcon />
                    </View>
                    <View style={myPosition.icon_2}>
                      <UsdcIcon />
                    </View>
                  </View>
                  <Text style={myPosition.positionValue}>USDC/WBNB</Text>
                </View>
                <View style={[myPosition.positionItem, {left: '52%'}]}>
                  <Text style={myPosition.positionLabel}>My Position</Text>
                  <Text style={myPosition.positionValue}>0.25%</Text>
                </View>
                <View style={[myPosition.positionItem, {right: '24%'}]}>
                  <Text style={myPosition.positionLabel}>APR</Text>
                  <Text style={myPosition.positionValue}>$10.80</Text>
                </View>
              </View>
              <View style={myPosition.positionRow}>
                <View style={[myPosition.positionItem, {left: '15%'}]}>
                  <Text style={myPosition.positionLabel}>Pooled USDC</Text>
                  <View style={myPosition.iconRow}>
                    <Text style={myPosition.positionValue}>0.58</Text>
                    <UsdcIcon height={10} width={10} />
                  </View>
                </View>
                <View style={[myPosition.positionItem, {left: '50%'}]}>
                  <Text style={myPosition.positionLabel}>Pooled WBNB</Text>
                  <View style={myPosition.iconRow}>
                    <Text style={myPosition.positionValue}>1.55</Text>
                    <BnbIcon height={10} width={10} />
                  </View>
                </View>
                <View style={[myPosition.positionItem, {right: '15%'}]}>
                  <Text style={myPosition.positionLabel}>Pending Rewards</Text>
                  <Text style={myPosition.positionValue}>10$</Text>
                </View>
              </View>
              <TouchableOpacity style={myPosition.harvestButton}>
                <Text style={myPosition.harvestText}>HARVEST</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // paddingTop: 80,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    backgroundColor: '#000000',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    height: '100%',
    marginTop: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginTop: 80,
    marginBottom: 24,
  },
  contentContainer: {
    flex: 1,
    top: 10,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    /* Note: backdrop-filter has minimal browser support */
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    width: 180,
    height: 60,
    left: 8,
    top: 50,
    fontWeight: 600,
    fontSize: 22,
    color: '#FA5001',
  },
  overview: {
    height: '30%',
  },
  myPosition: {
    height: '48%',
    marginTop: 10,
  },
  initText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 400,
  },
  subTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 400,
    marginLeft: 4,
  },
  overviewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 35,
    top: '20%',
  },
  overviewRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  overviewValue: {
    fontSize: 32,
    color: '#FA5001',
    fontWeight: 600,
  },
  separator: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3A3A3A',
    height: 50,
    alignSelf: 'center',
  },
});

const myPosition = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 8,
  },
  toggleWrapper: {
    width: 150,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
    position: 'relative',
  },
  contentWrapper: {
    backgroundColor: 'rgba(115,115,115,0.16)',
    borderColor: '#3A3A3A',
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    position: 'relative',
    marginTop: 20,
    padding: 10,
  },
  slider: {
    position: 'absolute',
    width: 64,
    height: 30,
    backgroundColor: '#FA5001', // Orange
    borderRadius: 12,
    zIndex: 0,
    margin: 4,
  },
  option: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 400,
  },
  positionRow: {
    paddingHorizontal: 40,
    paddingVertical: 25,
    // top: '10%',
    // paddingTop: '23%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  positionItem: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
  },
  positionLabel: {
    color: '#A8A8A8',
    fontSize: 10,
    fontWeight: 400,
  },
  positionValue: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 400,
  },
  harvestButton: {
    // top: '10%',
    backgroundColor: '#FA5001',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#FA5001',
    borderRadius: 12,
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  harvestText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon_1: {
    left: '10%',
  },
  icon_2: {
    right: '10%',
  },
});

export default Portfolio;
