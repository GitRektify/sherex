import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Warnning from '@/assets/svg/outline.svg';

const EditableStakingLockPeriod = ({ title, onChange, options }) => {
  const handleValueChange = (strValue, index) => {
    const match = strValue.match(/\d+(\.\d*)?/);
    const value = match ? match[0] : "";
    // Tạo bản sao mới của mảng để tránh thay đổi trực tiếp
    const newOptions = [...options];
    newOptions[index] = value;
    onChange(newOptions);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Warnning width={18} height={18} />
      </View>
      <View style={styles.inputRow}>
        {options.map((option, index) => (
          <View key={`${option}-${index}=${option}-${index}==${option}-${index}`} style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              defaultValue={option}
              onChangeText={(text) => handleValueChange(text, index)}
              keyboardType="numeric"
              textAlign="center"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '23%',
  },
  input: {
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#404040',
    color: '#fff',
    backgroundColor: '#282828',
  },
});

export default EditableStakingLockPeriod;
