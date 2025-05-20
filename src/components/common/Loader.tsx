import React, {useRef, useState} from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import SherexPic from '@/assets/image/sherex.png';
import FastImage from 'react-native-fast-image'
import {BlurView} from '@react-native-community/blur'

const {width, height} = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      {/* <BlurView
        style={styles.blurView}
        blurType="dark" // options: 'light', 'dark', 'extraLight', etc.
        blurAmount={5}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.7)"
      /> */}
      <FastImage
        source={require('@/assets/animations/loading.gif')}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.animation}
      />
      <Image source={SherexPic} style={styles.sheRexIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  sheRexIcon: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)', // fallback overlay
    width: width,
    height: height,
  },
});
