import React from 'react';
import { TouchableOpacity, Text, Image, View, StyleSheet } from 'react-native';
import { getTokenLogo } from '@/utils/index';

const TokenSelectButton = (props) => {
    const Letter = props.item.symbol;
    const address = props.item.address;
    const ImgURL = props.item.imgurl;
    const idx = props.index;

    return (
        <TouchableOpacity
            onPress={() => props.handleItem(idx)}
            style={styles.buttonContainer}
        >
            <View style={styles.row}>
                {Letter === 'SHRX' ?
                    <Image source={require('@/assets/image/sherex.png')}
                        style={styles.icon} />
                    : <Image source={{ uri: ImgURL }} style={styles.icon} />}
                <Text style={styles.symbol}>{Letter}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        borderRadius: 10,
    },
    symbol: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'white',
        paddingLeft: 8,
    },
});

export default TokenSelectButton;
