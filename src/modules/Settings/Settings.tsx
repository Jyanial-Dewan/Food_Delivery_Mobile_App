import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import Header1 from '../../common/components/Header1';
const Settings = () => {
  const theme = useTheme();
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      header={
        <Header1
          title="Settings"
          // rightFuncTitle="View"
          // rightFuncPress={() => {}}
        />
      }>
      <Text>Settings</Text>
    </ContainerNew>
  );
};
export default Settings;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
