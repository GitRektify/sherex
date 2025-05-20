import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { isAddress } from "ethers";
import { useTranslation } from "react-i18next";
import { getDecimals, getName, getSymbol } from "@/utils/contract";

const NewTokenModal = ({ title }) => {
    const [address, setAddress] = useState("");
    const [tokens, setTokens] = useLocalStorage("tokens", []);
    const { t } = useTranslation();

    const handleAdd = async () => {
        if (!isAddress(address)) {
            Alert.alert(t("newTokenModal.errors.invalidAddress"));
            return;
        }

        const name = await getName(address);
        const symbol = await getSymbol(address);
        const decimals = await getDecimals(address);

        const filteredToken = tokens.filter((token) => token.address === address.toLowerCase());

        if (filteredToken.length > 0) {
            Alert.alert(t("newTokenModal.errors.tokenAlreadyAdded"));
            return;
        }

        setTokens([...tokens, {
            address: address.toLowerCase(),
            name: name,
            symbol: symbol,
            decimals: Number(decimals)
        }]);

        Alert.alert(t("newTokenModal.success.tokenAdded", { symbol: symbol }));
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={t("newTokenModal.enterAddress")}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>{t("newTokenModal.addToken")}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        alignItems: "center",
    },
    input: {
        width: "100%",
        textAlign: "center",
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "transparent",
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: 'rgb(255, 255, 255)',
    },
    button: {
        paddingVertical: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: "center",
        backgroundColor: '#FA5401',
    },
    buttonText: {
        fontSize: 16,
        color: "white",
    },
});

export default NewTokenModal;
