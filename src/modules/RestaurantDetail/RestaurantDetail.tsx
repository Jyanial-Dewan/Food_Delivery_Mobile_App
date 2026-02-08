import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {IFoodItem} from '../../types/GeneralTypes';
import {BaseURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import ContainerNew from '../../common/components/Container';
import {Image} from 'react-native';

const RestaurantDetail = () => {
  const route = useRoute();
  const {restaurantId} = route.params as {restaurantId: number};
  const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadFoodItems = async () => {
      const api_params = {
        url: `/api/food_items?user_id=${restaurantId}&page=${currentPage}&limit=5`,
        baseURL: BaseURL,
        //   access_token: userInfo?.access_token,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setFoodItems(res.data.result);
    };

    loadFoodItems();
  }, [currentPage, restaurantId]);
  console.log(foodItems);
  return (
    <ContainerNew style={styles.container}>
      <View>
        <Text style={{marginBottom: 10}}>Food Items List</Text>
        <FlatList
          data={foodItems}
          keyExtractor={item => String(item.food_id)}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.boxStyle}>
              <View>
                <Text>{item.name}</Text>
                <Text>{item.price} Taka</Text>
                <Text style={{maxWidth: '80%'}}>
                  {item.description?.slice(0, 80)}
                </Text>
              </View>
              <Image
                source={{uri: `${BaseURL}/${item.image_urls[0]}`}}
                style={styles.imageStyle}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </ContainerNew>
  );
};

export default RestaurantDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  boxStyle: {
    marginBottom: 20,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
