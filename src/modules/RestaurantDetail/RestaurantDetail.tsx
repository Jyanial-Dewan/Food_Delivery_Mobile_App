import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IFoodItem} from '../../types/GeneralTypes';
import {BaseURL} from '../../../App';
import {httpRequest} from '../../common/constant/httpRequest';
import ContainerNew from '../../common/components/Container';
import {Image} from 'react-native';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ICartItem} from '../../types/CartTypes';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../stores/Redux/Slices/CartSlice';
import {RootState} from '../../stores/Redux/Store/Store';
import {RootStackScreensParms} from '../../types/RootStactTypes';
import Spinner from '../../common/components/Spinner';
import {api} from '../../common/apis/api';

const RestaurantDetail = () => {
  const route = useRoute();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<RootStackScreensParms>();
  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const {restaurantId} = route.params as {restaurantId: number};
  const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const cartIds = cart?.map(item => item.food_id);

  useEffect(() => {
    const loadFoodItems = async () => {
      const api_params = {
        url: `${api.FoodItem}?user_id=${restaurantId}&page=${currentPage}&limit=5`,
        baseURL: BaseURL,
        //   access_token: userInfo?.access_token,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      console.log(res.data.result, restaurantId, 'restaurant ID');
      setFoodItems(res.data.result);
    };

    loadFoodItems();
  }, [currentPage, restaurantId]);

  const handleAddToCart = (item: ICartItem) => {
    dispatch(addToCart(item));
  };

  const handleNavigate = (foodId: number) => {
    navigation.navigate('SingleFoodItem', {
      foodId: foodId,
    });
  };
  return (
    <ContainerNew style={styles.container}>
      <View>
        <Text style={[styles.popularText, {color: theme.colors.surface}]}>
          Popular Items
        </Text>

        {isLoading ? (
          <View style={styles.spinnerContainer}>
            <Spinner size={'large'} color={theme.colors.primary} />
          </View>
        ) : foodItems.length === 0 ? (
          <Text style={{color: theme.colors.surface}}>No Result</Text>
        ) : (
          <View style={styles.foodItemsContainer}>
            {foodItems.map(item => (
              <View key={item.food_id} style={styles.foodItemContainer}>
                <TouchableOpacity onPress={() => handleNavigate(item.food_id)}>
                  <Image
                    source={{uri: `${BaseURL}/${item.image_urls[0]}`}}
                    style={styles.imageStyle}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
                <Text style={{color: theme.colors.surface}}>{item.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={{color: theme.colors.primary}}>
                    {item.discount_price} Taka
                  </Text>
                  <Text
                    style={[
                      styles.lineThroughText,
                      {color: theme.colors.surface},
                    ]}>
                    {item.price} Taka
                  </Text>
                  <TouchableOpacity
                    disabled={cartIds?.includes(item.food_id)}
                    style={[
                      styles.cartButton,
                      {opacity: cartIds?.includes(item.food_id) ? 0.5 : 1},
                    ]}
                    onPress={() =>
                      handleAddToCart({
                        user_id: user.user_id,
                        food_id: item.food_id,
                        quantity: 1,
                        name: item.name,
                        discount_price: item.discount_price as number,
                        image_url: item.image_urls,
                      })
                    }>
                    <AntDesign name="plus" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
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
    width: '100%',
    height: 100,
    borderRadius: 8,
  },

  foodItemsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  priceContainer: {flexDirection: 'row', gap: 10, alignItems: 'center'},
  cartButton: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 99,
  },
  popularText: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  spinnerContainer: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  foodItemContainer: {width: '48%', gap: 6},
  lineThroughText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
