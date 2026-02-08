import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IUser} from '../../types/GeneralTypes';
import {BaseURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import {useNavigation} from '@react-navigation/native';
import {RestaurantDetailNavigationProp} from '../../types/HomeStackTypes';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigation = useNavigation<RestaurantDetailNavigationProp>();

  useEffect(() => {
    const loadRestaurants = async () => {
      const api_params = {
        url: `/api/users/restaurants?page=${currentPage}&limit=20`,
        baseURL: BaseURL,
        //   access_token: userInfo?.access_token,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setRestaurants(res.data.result);
    };

    loadRestaurants();
  }, [currentPage]);

  const handlePress = (restaurantId: number) => {
    navigation.navigate('RestaurantDetail', {
      restaurantId: restaurantId,
    });
  };

  return (
    <View>
      <Text style={{marginBottom: 10}}>Restaurant List</Text>
      <FlatList
        data={restaurants}
        keyExtractor={item => String(item.user_id)}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.boxStyle}
            onPress={() => handlePress(item.user_id)}>
            <Image
              source={{uri: `${BaseURL}/${item.profile_image_thumbnail}`}}
              style={styles.imageStyle}
              resizeMode="contain"
            />
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default RestaurantList;

const styles = StyleSheet.create({
  boxStyle: {
    marginBottom: 20,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
