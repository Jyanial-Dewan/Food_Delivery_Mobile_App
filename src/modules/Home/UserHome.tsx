import {ImageBackground, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import RestaurantList from './RestaurantList';
import ImageFlatList from './ImageFlatList';
import Feather from 'react-native-vector-icons/Feather';
import BgImage from '../../assets/Banner/Burger.jpg';

const UserHome = () => {
  const [search, setSearch] = useState('');
  return (
    <>
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

      <View style={styles.bannerContainer}>
        <ImageBackground source={BgImage} style={{flex: 1}} resizeMode="cover">
          <View style={styles.background}>
            <Text style={styles.bannerText}>35% OFF on Burgers!</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.listContainer}>
        <ImageFlatList />
      </View>

      <View style={styles.listContainer}>
        <RestaurantList />
      </View>
    </>
  );
};

export default UserHome;

const styles = StyleSheet.create({
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
  bannerContainer: {marginTop: 20, height: 150, borderRadius: 8},
  bannerText: {fontSize: 35, color: 'white'},
  listContainer: {marginTop: 20, flex: 1},
});
