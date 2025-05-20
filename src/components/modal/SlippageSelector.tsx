import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const SlippageSelector = ({ title, value, onChange, options }) => {
    const [isCustom, setIsCustom] = useState(false);
    const [customValue, setCustomValue] = useState("");

    useEffect(() => {
        if (!options.includes(value)) {
            setIsCustom(true);
            setCustomValue(value);
        } else {
            setIsCustom(false);
            setCustomValue(value);
        }
    }, [value, options]);

    const handleValueChange = (newValue, isCustomInput = false) => {
        if (isCustomInput) {
            setIsCustom(true);
            setCustomValue(newValue);
            onChange(newValue);
        } else {
            setIsCustom(false);
            setCustomValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.buttonContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={'slippage-selector'+index}
                        onPress={() => handleValueChange(option)}
                        style={[
                            styles.optionButton,
                            value === option && !isCustom && styles.selectedButton,
                            index !== options.length - 1 ? { marginHorizontal: "2%" } : {} // Thay gap bằng marginRight
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            {option}%
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, isCustom && styles.inputSelected]}
                        value={customValue !== null && customValue !== undefined ? String(customValue) : ""}
                        keyboardType="numeric"
                        onChangeText={(text) => handleValueChange(text, true)}
                        placeholder="Custom"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    />
                    <Text style={styles.percentSymbol}>%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        // paddingHorizontal: 4,
    },
    title: {
        color: "white",
        marginBottom: 8,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
    optionButton: {
        alignItems: "center",
        width: "20%",
        // paddingHorizontal: "1%",
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        marginHorizontal: "2%",
    },
    selectedButton: {
        // width: "20%",
        backgroundColor: '#FA5401',
        borderColor: "transparent",
    },
    buttonText: {
        color: "white",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        width: "20%",
        marginLeft: "2%"
    },
    input: {
        width: "90%",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white",
        // paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "white",
        textAlign: "center",
    },
    inputSelected: {
        borderColor: "#F3BA2F",
    },
    percentSymbol: {
        // position: "absolute",
        // right: -15,
        paddingHorizontal: "3%",
        color: "white",
        fontSize: 16,
    },
});

export default SlippageSelector;
