import {ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
}

const Spinner = ({size = 'small', color = 'white'}: SpinnerProps) => {
  return (
    <ActivityIndicator size={size} color={color} style={styles.loadingStyle} />
  );
};

export default Spinner;

const styles = StyleSheet.create({
  loadingStyle: {
    transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    paddingLeft: 10,
  },
});
