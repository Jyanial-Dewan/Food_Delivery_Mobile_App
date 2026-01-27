import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ContainerNew from '../../common/components/Container';
import Header1 from '../../common/components/Header1';
import {useTheme} from 'react-native-paper';

const MyAccount = () => {
  const theme = useTheme();
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      header={
        <Header1
          title="My Account"
          rightFuncTitle="View"
          rightFuncPress={() => {}}
        />
      }>
      <Text>MyAccount</Text>
    </ContainerNew>
  );
};
export default MyAccount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
