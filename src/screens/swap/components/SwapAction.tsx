import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { RootState } from '@/stores/index';
import StakingChart from '../../staking/components/StakingChart';
import StakingSetting from '../../staking/components/StakingSetting';
import SwapSettingModal from '@/components/modal/SwapSettingModal';
import { FullScreenImage, SizedBox } from '@/components/general/shared_styled';

const SwapAction = () => {
    // States for modal and settings
    const [isSettingModal, setIsSettingModal] = useState(false);
    const [swapSlippage, setSwapSlippage] = useLocalStorage('swapSlippage', '0.5');
    const [liquiditySlippage, setLiquiditySlippage] = useLocalStorage('liquiditySlippage', '0.5');
    const [txDeadline, setTxDeadline] = useLocalStorage('txDeadline', '30');
    const dispatch = useDispatch();

    const { tokens } = useSelector((state: RootState) => state.tokens);
    const { swaps, loading: swapsLoading } = useSelector((state: RootState) => state.swaps);

    const [info, setInfo] = useState({
        token0: {
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
        isNative: true,
        logo: 'https://bscscan.com/token/images/bnbchain2_32.png'
        },
        token1: {
        address: "0x55d398326f99059ff775485246999027b3197955",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 18,
        logo: 'https://bscscan.com/token/images/busdt_32.png'
        },
        amount0: 0,
        amount1: 0,
    });

    const handleSetting = () => {
        setIsSettingModal(true); // This opens the modal
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.contentContainer}>
                <StakingSetting
                    info={info}
                    liquiditySlippage={liquiditySlippage}
                    setInfo={setInfo}
                    handleSetting={handleSetting}
                />
                <SizedBox height={40} />
                {/* Uncomment this line to show the StakingChart */}
                {/* <StakingChart info={info} swaps={swaps} /> */}

                {/* Swap Setting Modal */}
                <SwapSettingModal

                    isSettingModal={isSettingModal}
                    setIsSettingModal={setIsSettingModal}
                    swapSlippage={swapSlippage}
                    setSwapSlippage={setSwapSlippage}
                    liquiditySlippage={liquiditySlippage}
                    setLiquiditySlippage={setLiquiditySlippage}
                    txDeadline={txDeadline}
                    setTxDeadline={setTxDeadline}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginBottom: 10,
        fontFamily: 'Poppins', // Make sure the font is properly imported
        fontStyle: 'normal',
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
    },
});

export default SwapAction;