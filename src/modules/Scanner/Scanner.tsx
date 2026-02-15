import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

function Scanner() {
  const device = useCameraDevice('back');
  const theme = useTheme();
  const {hasPermission, requestPermission} = useCameraPermission();
  const [scannedValue, setScannedValue] = useState('');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (value) {
        setScannedValue(value);
      }
    },
  });

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>No camera device found</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      {/* Overlay text */}
      <View style={styles.overlay}>
        <Text style={[styles.text, {color: theme.colors.surface}]}>
          {scannedValue}
        </Text>
      </View>
    </View>
  );
}

export default Scanner;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
  },
});
