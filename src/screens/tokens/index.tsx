import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator, StyleSheet, TextInput, Text, View, TouchableOpacity } from "react-native";

import { AppText, CustomImage, FullScreenImage, Input } from '@/components/general/shared_styled';
import { ThemeColors } from '@/utils/colors';
import TokenTable from './components/TokenTable';
import { RootState } from '@/stores/index';
import Svg, { Path } from 'react-native-svg';
import SettingModal from "@/components/modal/SettingModal";
import NewTokenModal from "@/components/modal/NewTokenModal";
import TokenChart from './components/TokenDetail';
import LoadingScreen from '@/components/common/Loader';

const Tokens = () => {
    const [isTokenModal, setIsTokenModal] = useState(false);
    useEffect(() => {
        console.log("Tokens component mounted");
    }, []);

    console.log("Tokens rendered");

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { tokens, loading } = useSelector((state: RootState) => state.tokens);

    return (
        <View style={styles.container}>
            <FullScreenImage
                source={require('@/assets/image/background.png')}
            />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingScreen/>
                    {/* <ActivityIndicator size="large" color="#F3BA2F" /> */}
                </View>
            ) : (
                <TokenTable tokenData={tokens || []} />
            )}

            <SettingModal isVisible={isTokenModal} onClose={() => setIsTokenModal(false)} title={t("newTokenModal.title")} isSmall>
                <NewTokenModal title={undefined} />
            </SettingModal>
            {/* <TokenChart tokenUri={'../../../assets/image/background.png'}/> */}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 120,
        // paddingBottom: 16,
        paddingHorizontal: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Tokens;