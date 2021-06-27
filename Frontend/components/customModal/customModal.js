import React from 'react';
import { Text, View, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const CustomModal = ({ children, open, setOpen }) => {
  return (
    <>
      <Modal animationType={'fade'} transparent={true} visible={open}>
        <View style={styles.modalOverlay}></View>
      </Modal>
      <Modal animationType={'slide'} transparent={true} visible={open}>
        <TouchableOpacity
          style={styles.modalTouchOutside}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        ></TouchableOpacity>
        <View style={[styles.modalContainer, { paddingTop: 8 }]}>
          {children}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    backgroundColor: '#000',
  },
  modalContainer: {
    width: '100%',
    left: 0,
    bottom: 0,
    position: 'absolute',
    flex: 1,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
  },
  modalTouchOutside: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});

export default CustomModal;
