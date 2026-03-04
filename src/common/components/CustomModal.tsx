import {Modal, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import React from 'react';
import {COLORS} from '../constant/Themes';

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  top?: number;
  right?: number;
}

const CustomModal = ({
  showModal,
  setShowModal,
  children,
  top = 0,
  right = 0,
}: Props) => {
  return (
    <Modal transparent visible={showModal} animationType="fade">
      {/* Close modal when clicking outside */}
      <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          {/* Prevent modal from closing when clicking inside */}
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, {top}, {right}]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.lightBackground,
    width: '96%',
    padding: 6,
    borderRadius: 8,
    maxHeight: 500,
    // position: 'absolute',
    // Ensures scrollability
  },
});
