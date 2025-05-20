import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SlippageSelectorSwap = ({ title, value, onChange, options }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handleValueChange = (newValue, isCustomInput = false) => {
    if (isCustomInput) {
      setIsCustom(true);
      setCustomValue(newValue);
      onChange(newValue);
    } else {
      setIsCustom(false);
      setCustomValue('');
      onChange(newValue);
    }
  };

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.buttonRow}>
        {options.map((option, idx) => {
          const selected = value === option && !isCustom;
          return (
            <TouchableOpacity
              key={'slippage-selector-swap' + idx}
              onPress={() => handleValueChange(option)}
              style={[
                styles.button,
                selected ? styles.selectedButton : styles.unselectedButton,
              ]}
            >
              <Text style={[styles.buttonText, styles.unselectedText]}>
                {option}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  title: {
    color: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '24%',
    // height: 40,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    // marginBottom: 8,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FA5001',
    borderColor: 'transparent',
  },
  unselectedButton: {
    backgroundColor: '#282828',
    borderColor: '#404040',
  },
  buttonText: {
    fontSize: 10,
  },
  unselectedText: {
    color: '#fff',
  },
});

export default SlippageSelectorSwap;
