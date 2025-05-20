import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LiquidityTableHeader = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('concentrated');
  const [showDropdown, setShowDropdown] = useState(false);

  // Nếu cần dropdown cho tab, bạn có thể triển khai thêm.
  // Ở đây mình chỉ chuyển đổi phần search và nút "Create" cho mobile.

  return (
    <View style={styles.container}>
      {/* Mobile Header */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.createButton}
        //   onPress={() => navigation.navigate('LiquidityPoolRoute')}
        >
          <Text style={styles.createButtonText}>{t('liquidityTable.create')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search All"
          placeholderTextColor="#fff"
        />
        <Image
          source={require('../../../../assets/icon/search.svg')}
          style={styles.searchIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    // Để tạo hiệu ứng gradient, bạn có thể dùng react-native-linear-gradient
    backgroundColor: '#CF7D33',
  },
  createButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    paddingLeft: 12,
    paddingRight: 40, // Dành chỗ cho icon
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    width: 16,
    height: 16,
    transform: [{ translateY: -8 }],
  },
});

export default LiquidityTableHeader;
