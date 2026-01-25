import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import Header1 from '../../common/components/Header1';
const MyOrders = () => {
  const theme = useTheme();
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      header={
        <Header1
          title="My Orders"
          // rightFuncTitle="View"
          // rightFuncPress={() => {}}
        />
      }>
      <Text>MyOrders</Text>
    </ContainerNew>
  );
};
export default MyOrders;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
