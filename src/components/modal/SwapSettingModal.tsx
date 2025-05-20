import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import SlippageSelector from "./SlippageSelector";
import SlippageSelectorSwap from './SlippageSelectorSwap';

const SwapSettingModal = ({
  isSettingModal,
  setIsSettingModal,
  swapSlippage,
  setSwapSlippage,
  liquiditySlippage,
  setLiquiditySlippage,
  txDeadline,
  setTxDeadline
}) => {
  const { t } = useTranslation();

  const [inSwapSlippage, setInSwapSlippage] = useState(swapSlippage);
  const [inLiquiditySlippage, setInLiquiditySlippage] = useState(liquiditySlippage);
  const [inTxDeadline, setInTxDeadline] = useState(txDeadline);

  const handleTxDeadlineChange = (value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      setInTxDeadline(numericValue);
    }
  };

  const handleApply = () => {
    setSwapSlippage(inSwapSlippage);
    setLiquiditySlippage(inLiquiditySlippage);
    setTxDeadline(inTxDeadline);
    setIsSettingModal(false);
  };

  return (
    <Modal
      visible={isSettingModal}
      transparent
      animationType="slide"
      onRequestClose={() => setIsSettingModal(false)}
    >
      <TouchableOpacity onPress={() => setIsSettingModal(false)} style={styles.close} />
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{t("swapModal.title")}</Text>

          <SlippageSelectorSwap
            title={t("swapModal.swapSlippage")}
            value={inSwapSlippage}
            onChange={setInSwapSlippage}
            options={[t("swapModal.default"), t("swapModal.instant"), t("swapModal.standard"), t("swapModal.fast")]}
          />
          <SlippageSelector
            title={t("swapModal.liquiditySlippage")}
            value={inLiquiditySlippage}
            onChange={setInLiquiditySlippage}
            options={["0.5", "1.0", "3.0"]}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("swapModal.txDeadline")}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={String(inTxDeadline)}
                keyboardType="numeric"
                onChangeText={handleTxDeadlineChange}
              />
              <Text style={styles.label}>{t("swapModal.min")}</Text>
              <TouchableOpacity style={styles.resetButton} onPress={() => setInTxDeadline("0")}>
                <Text style={styles.resetText}>{t("swapModal.reset")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>{t("newTokenModal.apply")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Làm mờ nền
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 8,
    paddingVertical: 20,
    borderRadius: 12,
    // alignItems: "center",
  },
  title: {
    color: '#FA5001',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 12,
  },
  inputContainer: {
    marginTop: 20,
    // alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  input: {
    width: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    textAlign: "center",
  },
  resetButton: {
    // marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    // alignSelf: "center",
  },
  resetText: {
    color: "white",
    fontSize: 14,
  },
  applyButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  applyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SwapSettingModal;
