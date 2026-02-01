import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {secureStorage} from '../../utils/Storage/mmkv';
import {useNavigation} from '@react-navigation/native';
import ContainerNew from '../../common/components/Container';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'react-native-paper';
import BgImage from '../../assets/Banner/Burger.jpg';
import ImageFlatList from './ImageFlatList';
import RestaurantList from './RestaurantList';

const Home = () => {
  const theme = useTheme();
  const drawerNav = useNavigation<any>();
  const user = secureStorage.getItem('user');
  const [search, setSearch] = useState('');
  console.log(user);
  return (
    <ContainerNew style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={{gap: 8}}>
          <Text
            style={[styles.text, {color: theme.colors.surface, fontSize: 14}]}>
            Hi, {user}
          </Text>
          <Text
            style={[styles.text, {color: theme.colors.surface, fontSize: 16}]}>
            What are you craving?
          </Text>
        </View>
        <TouchableOpacity
          onPress={drawerNav.toggleDrawer}
          style={styles.drawerIcon}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View>
          <Feather name="search" size={24} color="#ccc" />
        </View>
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={{marginTop: 20, height: 150, borderRadius: 8}}>
        <ImageBackground source={BgImage} style={{flex: 1}} resizeMode="cover">
          <View style={styles.background}>
            <Text style={[styles.text, {fontSize: 35, color: 'white'}]}>
              35% OFF on Burgers!
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={{marginTop: 20}}>
        <ImageFlatList />
      </View>

      <View style={{marginTop: 20}}>
        <RestaurantList />
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
  headerContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerIcon: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  background: {
    flex: 1,
    backgroundColor: 'rgba(44, 39, 39, 0.49)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
