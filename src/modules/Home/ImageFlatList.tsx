import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import chineseImage from '../../assets/Images/Chinese1.jpg';
import pizzaImage from '../../assets/Images/Pizza1.jpg';
import biriyaniImage from '../../assets/Images/Biriyani1.jpg';
import bangladeshImage from '../../assets/Images/Bangladeshi_food1.jpg';
import bakeryImage from '../../assets/Images/Bakery1.jpg';
import burgerImage from '../../assets/Images/Burger1.jpeg';
import chickenImage from '../../assets/Images/Chicken_Curry1.jpg';
import coffeImage from '../../assets/Images/Coffee1.jpg';
import fastFoodImage from '../../assets/Images/Fast_food1.jpg';
import pastaImage from '../../assets/Images/Pasta1.jpg';
import kebabImage from '../../assets/Images/Kebab1.jpg';
import riceDishesImage from '../../assets/Images/Rice_Dishes1.jpg';
import shwarmaImage from '../../assets/Images/Shawrma1.jpg';
import snackImage from '../../assets/Images/Snacks1.jpg';

const images = [
  {id: '1', src: chineseImage, name: 'Chinese'},
  {id: '2', src: pizzaImage, name: 'Pizza'},
  {id: '3', src: biriyaniImage, name: 'Biriyani'},
  {id: '4', src: bangladeshImage, name: 'Bangladeshi'},
  {id: '5', src: bakeryImage, name: 'Bakery'},
  {id: '6', src: burgerImage, name: 'Burger'},
  {id: '7', src: chickenImage, name: 'Chicken'},
  {id: '8', src: coffeImage, name: 'Coffee'},
  {id: '9', src: fastFoodImage, name: 'Fast Food'},
  {id: '10', src: pastaImage, name: 'Pasta'},
  {id: '11', src: kebabImage, name: 'Kebab'},
  {id: '12', src: riceDishesImage, name: 'Rice Dishes'},
  {id: '13', src: shwarmaImage, name: 'Shawarma'},
  {id: '14', src: snackImage, name: 'Snacks'},
];

const ImageFlatList = () => {
  return (
    <FlatList
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View>
          <Image
            source={item.src}
            style={{width: 80, height: 60, marginRight: 10, borderRadius: 8}}
            resizeMode="cover"
          />
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
};

export default ImageFlatList;

const styles = StyleSheet.create({});
