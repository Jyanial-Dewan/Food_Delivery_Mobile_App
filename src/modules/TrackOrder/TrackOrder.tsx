import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';

const TrackOrder = () => {
  const theme = useTheme();
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.text}>Track Order</Text>
    </ContainerNew>
  );
};
export default TrackOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
