import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const DropdownResponsiveButton = ({ options, propButtons, handleSelect }) => {
  const [activeTime, setActiveTime] = useState('1m');
  const [showDropdown, setShowDropdown] = useState(false);

  // Nếu không có propButtons, dùng default:
  const defaultButtons = [
    { value: '24h', label: 'Volume' },
    { value: '1w', label: 'Liquidity' },
    { value: '1m', label: 'Fees' },
    { value: 'TVL', label: 'TVL' },
  ];
  const buttons = propButtons || defaultButtons;
  // Giả sử rằng "options" truyền vào có cấu trúc tương tự (mảng đối tượng với value và label).

  const handleActiveTime = (value) => {
    setActiveTime(value);
    handleSelect(value);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {options.find(opt => opt.value === activeTime)?.label || 'Select'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={'dropdown-responsive-button-'+index}
                onPress={() => {
                  handleActiveTime(option.value);
                  setShowDropdown(false);
                }}
                style={[
                  styles.dropdownItem,
                  activeTime === option.value && styles.activeDropdownItem,
                ]}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    activeTime === option.value && styles.activeDropdownItemText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    right: 20,
    top: 100, // Điều chỉnh theo vị trí mong muốn
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeDropdownItem: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
  activeDropdownItemText: {
    color: '#F3BA2F',
  },
});

export default DropdownResponsiveButton;
