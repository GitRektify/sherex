import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from "react-i18next";

import SlippageSelector from "./SlippageSelector";

const ExchangeSettingModal = () => {
    const { t, i18n } = useTranslation();
    const [swapSlippage, setSwapSlippage] = useState("0.5");
    const [liquiditySlippage, setLiquiditySlippage] = useState("0.5");
    const isRTL = i18n.language === "ar";

    const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
        document.documentElement.dir = value === "ar" ? "rtl" : "ltr";
    };

    return (
        <View style={styles.container}>
            <SlippageSelector
                title={t("exchangeModal.swapSlippage")}
                value={swapSlippage}
                onChange={setSwapSlippage}
                options={["0.5", "1.0", "3.0"]}
            />
            <SlippageSelector
                title={t("exchangeModal.slippageTolerance")}
                value={liquiditySlippage}
                onChange={setLiquiditySlippage}
                options={["0.5", "1.0", "3.0"]}
            />
            <View style={styles.languageContainer}>
                {/* <Text style={styles.label}>{t("exchangeModal.language")}</Text> */}
                {/* <RNPickerSelect
                    onValueChange={(lang) => handleLanguageChange(lang)}
                    items={[
                        { label: "English", value: "en" },
                        { label: "العربية", value: "ar" }
                    ]}
                    placeholder={{ label: 'Select '+t('exchangeModal.language'), value: 'en' }}
                    style={pickerSelectStyles}
                    value={i18n.language}
                /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    languageContainer: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        // marginTop: 16,
    },
    label: {
        color: "white",
        marginBottom: 8,
    }
});

const pickerSelectStyles = {
    inputIOS: {
        color: "white",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        padding: 10,
        borderRadius: 8,
    },
    inputAndroid: {
        color: "white",
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        paddingRight: 30,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "rgba(255, 255, 255, 1)",
    }
};

export default ExchangeSettingModal;
