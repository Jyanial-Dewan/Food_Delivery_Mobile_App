import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ContainerNew from '../../common/components/Container';
import {useRoute} from '@react-navigation/native';
import {httpRequest} from '../../common/constant/httpRequest';
import {BaseURL} from '../../../App';
import {IFoodItem} from '../../types/GeneralTypes';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {toTitleCase} from '../../common/services/utility';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../stores/Redux/Slices/CartSlice';
import {RootState} from '../../stores/Redux/Store/Store';

const SingleFoodItem = () => {
  const route = useRoute();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const {foodId} = route.params as {foodId: number};
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [foodItem, setFoodItem] = useState<IFoodItem | undefined>(undefined);

  const {width} = Dimensions.get('window');
  const cartIds = cart?.map(item => item.food_id);
  useEffect(() => {
    const loadFoodItem = async () => {
      const api_params = {
        url: `/api/food_items?food_id=${foodId}`,
        baseURL: BaseURL,
        //   access_token: userInfo?.access_token,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setFoodItem(res.data.result);
    };

    loadFoodItem();
  }, [foodId]);

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        user_id: user.user_id,
        food_id: foodItem?.food_id as number,
        quantity: 1,
        name: foodItem?.name as string,
        discount_price: foodItem?.discount_price as number,
        image_url: foodItem?.image_urls as string[],
      }),
    );
  };

  return (
    <ContainerNew
      style={styles.container}
      footer={
        <View style={styles.footerContainer}>
          <Text style={[styles.priceText, {color: theme.colors.surface}]}>
            {foodItem?.discount_price} Taka
          </Text>
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={cartIds.includes(foodId)}
            style={[
              styles.cartButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: cartIds.includes(foodId) ? 0.2 : 1,
              },
            ]}>
            <Text style={styles.cartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      }>
      <View>
        <FlatList
          ref={flatListRef}
          data={foodItem?.image_urls}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Image
              source={{uri: `${BaseURL}/${item}`}}
              style={[styles.imageStyle, {width}]}
            />
          )}
        />

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {foodItem?.image_urls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? '#007AFF' : '#ccc',
                },
              ]}
            />
          ))}
        </View>

        {/* Rating and Calories Container */}
        <View
          style={[styles.ratingContainer, {borderColor: theme.colors.surface}]}>
          <View style={styles.ratingStyle}>
            <AntDesign name="star" size={20} color="#FFBF00" />
            <Text style={{color: theme.colors.surface}}>
              {foodItem?.avg_rating}
            </Text>
          </View>
          <View
            style={[
              styles.dividerStyle,
              {backgroundColor: theme.colors.surface},
            ]}
          />
          <Text style={{color: theme.colors.surface}}>
            {foodItem?.calories} kcal
          </Text>
          <View
            style={[
              styles.dividerStyle,
              {backgroundColor: theme.colors.surface},
            ]}
          />
          <Text style={{color: theme.colors.surface}}>
            {foodItem ? toTitleCase(foodItem.category) : ''}
          </Text>
        </View>

        <Text
          style={[
            styles.nameText,
            {
              color: theme.colors.surface,
            },
          ]}>
          {foodItem?.name}
        </Text>

        <Text style={{color: theme.colors.surface, marginTop: 10}}>
          {foodItem?.description}
        </Text>
      </View>
    </ContainerNew>
  );
};

export default SingleFoodItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dividerStyle: {
    height: '100%',
    width: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    padding: 6,
    marginTop: 10,
    borderRadius: 8,
  },
  ratingStyle: {flexDirection: 'row', gap: 4, alignItems: 'center'},
  nameText: {fontSize: 17, fontWeight: 'bold', marginTop: 10},
  cartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  cartButton: {
    width: 200,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '600',
  },
  imageStyle: {height: 300, borderRadius: 8},
});
