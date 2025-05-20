import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'react-native-linear-gradient';

import { getTokenLogo } from '@/utils/index';
import { CustomImage } from '@/components/general/shared_styled';
import TokenDetail from './TokenDetail';
import SettingModal from "@/components/modal/SettingModal";
import NewTokenModal from "@/components/modal/NewTokenModal";

import FoxIcon from '@/assets/svg/fox-sit.svg'
import SearchIcon from '@/assets/svg/search.svg'
import ListIcon from '@/assets/svg/list.svg'
import TriangleIcon from '@/assets/svg/triangle.svg'

export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  totalValueLocked: number;
}

export const formatNumber = (value: number) => {
  const num = parseFloat(value.toString()) || 0;
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
};

export const getImageSource = (uri: any) => {
  if (uri.startsWith('http') || uri.startsWith('https')) {
    return { uri }; // Dùng FastImage cho ảnh từ URL
  } else {
    if (uri.includes('sherex')) {
      return require('@/assets/image/sherex.png');
    }
  }
};

interface TokenTablesProps {
  tokenData: TokenData[];
}

const TokenTable: React.FC<TokenTablesProps> = ({ tokenData }) => {
  const { t } = useTranslation();

  const [filter, setFilter] = useState('Concentrated');
  const [search, setSearch] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [isTokenModal, setIsTokenModal] = useState(false);

  const handleSearch = () => {
    setSearch(!search)
  };

  const handleFilterChange = (type) => {
    setFilter(type);
  };

  const handleFilterSettings = () => {
    console.log('Filter settings clicked');
  };

  const renderTokenRow = (token: TokenData) => {
    const uri = getTokenLogo(token.id);


    const isRemoteImage = uri.startsWith('http') || uri.startsWith('https');
    return (
      <TouchableOpacity
        key={token.id}
        style={styles.cellContainer}
        onPress={() => {
          setSelectedToken(token)
        }}
      >
        <View style={[styles.cell, styles.nameCellContainer]}>
          {isRemoteImage ? (
            <CustomImage source={{ uri }} style={styles.tokenLogo} borderRadius={24} />
          ) : (
            <Image source={getImageSource(uri)} style={styles.tokenLogo} />
          )}
          <Text style={styles.nameCell}>{token.symbol}</Text>
        </View>
        <Text style={styles.generalCell}>${formatNumber(token.price)}</Text>
        <Text style={styles.priceCell}>{token.priceChange ? Number(token.priceChange).toFixed(2) : "0.00"}%</Text>
        <Text style={styles.generalCell}>${formatNumber(token.volume)}</Text>
        <Text style={styles.generalCell}>${formatNumber(token.totalValueLocked)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {selectedToken ? (
        <TokenDetail token={selectedToken} onBack={() => setSelectedToken(null)} />
      ) :
        (<>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{t("tokenTable.allTokens")}</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => setIsTokenModal(true)}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.wrapper}>
            <FoxIcon style={styles.fox} />
            <LinearGradient
              colors={['rgba(34, 34, 34, 0.6)', 'rgba(34, 34, 34, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.container}
            >
              <View style={styles.barContainer}>
                <View style={styles.barLeftContainer}>
                  {['All', 'Standard', 'Concentrated'].map((item, index) => (
                    <TouchableOpacity
                      key={'token-table-bar-left-container-' + index}
                      onPress={() => handleFilterChange(item)}
                      style={filter === item ? styles.barLeftButtonAction : styles.barLeftButton}
                    >
                      <Text style={filter === item ? styles.barLeftButtonTextAction : styles.barLeftButtonText}>{item}</Text>
                      {filter === item ? <TriangleIcon style={{ bottom: -6 }} /> : null}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* <View style={styles.barRightButtonContainer}>
                  <TouchableOpacity style={search ? styles.searchButtonAction : styles.barRightButton} onPress={handleSearch}>
                    <SearchIcon color={search ? '#FA5001' : '#FFFFFF'} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.barRightButton} onPress={handleFilterSettings}>
                    <ListIcon />
                  </TouchableOpacity>
                </View> */}
              </View>

              {
                search ?
                  <View style={styles.searchContainer}>
                    <SearchIcon style={styles.searchIcon} />
                    <TextInput
                      placeholder={t("nav.search")}
                      placeholderTextColor='rgba(255, 255, 255, 0.5)'
                      style={styles.searchInput}
                    />
                  </View> : null
              }

              <View style={styles.header}>
                {
                  ['Name', 'Price', 'Price Change', 'Volume 24h', 'TVL'].map((head, index) =>
                    <Text key={'token-table-5-' + index} style={styles.headerCell}>{head}</Text>
                  )
                }
              </View>

              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                {tokenData && tokenData.length > 0 ? (
                  tokenData.map(renderTokenRow)
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No tokens found</Text>
                  </View>
                )}
              </ScrollView>
            </LinearGradient>
            <SettingModal isVisible={isTokenModal} onClose={() => setIsTokenModal(false)} title={t("newTokenModal.title")} isSmall>
              <NewTokenModal title={undefined} />
            </SettingModal>
          </View></>)
      }</>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  fox: {
    position: 'absolute',
    left: '40%',
    right: '60%',
    width: 48,
    height: 48,
    top: -24,
  },
  title: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 22,
    color: '#FA5001',
  },
  container: {
    flex: 1,
    borderRadius: 12,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: '#404040',
    overflow: 'hidden',
  },
  headerContainer: {
    // marginTop: 120,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  createButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#FA5001',
  },
  createButtonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 12,
    color: '#FFFFFF',
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#404040',
  },
  barLeftContainer: {
    marginTop: 20,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barLeftButton: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0,
    borderColor: '#FA5001',
  },
  barLeftButtonAction: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderColor: '#FA5001',
  },
  barLeftButtonText: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#ffffff',
  },
  barLeftButtonTextAction: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#FA5001',
  },
  barRightButtonContainer: {
    flexDirection: 'row',
    marginRight: 12,
    gap: 4,
  },
  barRightButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  searchButtonAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FA5001',
    borderRadius: 12,
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 12,
    color: '#FFFFFF',
  },
  searchIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  headerCell: {
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '20%',
    paddingHorizontal: 4,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  cell: {
    alignItems: 'center',
  },
  tvlCell: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    marginVertical: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(115, 115, 115, 0.16)',
    borderColor: '#3A3A3A',
  },
  nameCellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '20%',
    color: 'rgba(255, 255, 255, 1)',
  },
  tokenLogo: {
    position: 'absolute',
    width: 24,
    height: 24,
    padding: 4,
    marginLeft: 8,
    borderRadius: 40,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  nameCell: {
    textAlign: 'center',
    textAlignVertical: 'center',
    left: 24,
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 1)',
  },
  generalCell: {
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '20%',
    paddingHorizontal: 4,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 1)',
  },
  priceCell: {
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '20%',
    paddingHorizontal: 4,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    color: '#1AEFAF',
  },
  row: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  tokenInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenNameContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  tokenName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenSymbol: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default TokenTable;