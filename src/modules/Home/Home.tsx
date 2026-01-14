import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {secureStorage} from '../../utils/Storage/mmkv';
import {useNavigation} from '@react-navigation/native';
import ContainerNew from '../../common/components/Container';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = () => {
  const drawerNav = useNavigation<any>();
  const user = secureStorage.getItem('user');
  console.log(user);
  return (
    <ContainerNew style={styles.container}>
      <View style={{gap: 10}}>
        <TouchableOpacity
          onPress={drawerNav.toggleDrawer}
          style={styles.drawerIcon}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="gray"
          />
        </TouchableOpacity>
        <View>
          <Text>Welcome, {user}</Text>
        </View>
      </View>
    </ContainerNew>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  drawerIcon: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
