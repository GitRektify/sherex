import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

import CloseIcon from '@/assets/svg/close.svg'

type SettingModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string | 'Setting';
  isSmall?: boolean | false;
};

const SettingModal = ({ isVisible, onClose, children, title, isSmall = false }: SettingModalProps) => {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          // intensity={100}
          // tint='dark'
          style={styles.blurButton}
        />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
        <View style={[styles.modalView, isSmall ? styles.modalSmall : styles.modalLarge]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}  style={{cursor: 'pointer'}}>
              <CloseIcon/>
            </TouchableOpacity>
          </View>
          <View>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurButton: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34, 34, 34, 0.8)',
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(34, 34, 34, 1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderColor: '#404040',
    borderWidth: 1,
    width: '90%',
  },
  modalSmall: {
    maxWidth: 450,
  },
  modalLarge: {
    maxWidth: 540,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FA5401',
  },
});

export default SettingModal;
