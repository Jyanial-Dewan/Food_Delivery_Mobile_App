import React from 'react';
import {StyleSheet, Text} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
const Profile = () => {
  const theme = useTheme();
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.text}>Profile</Text>
    </ContainerNew>
  );
};
export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
