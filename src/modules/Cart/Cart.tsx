import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {BaseURL} from '../../../App';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from '../../stores/Redux/Slices/CartSlice';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Cart = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const handleIncreaseQuantity = (foodId: number) => {
    dispatch(increaseQuantity(foodId));
  };

  const handleDecreaseQuantity = (foodId: number) => {
    dispatch(decreaseQuantity(foodId));
  };

  const handleRemoveItem = (foodId: number) => {
    dispatch(removeItem(foodId));
  };

  const total = cart.reduce((sum, item) => {
    return sum + item.discount_price * item.quantity;
  }, 0);

  return (
    <ContainerNew
      isScrollView={false}
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={styles.text}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => `${item.food_id}_${item.user_id}`}
        renderItem={({item}) => (
          <View style={styles.boxContainer}>
            <View>
              <Text style={{color: theme.colors.surface}}>{item.name}</Text>
              <View
                style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <View
                  style={[
                    styles.buttonBox,
                    {borderColor: theme.colors.surface},
                  ]}>
                  <TouchableOpacity
                    onPress={() => handleIncreaseQuantity(item.food_id)}>
                    <AntDesign
                      name="plus"
                      size={20}
                      color={theme.colors.surface}
                    />
                  </TouchableOpacity>
                  <Text style={{color: theme.colors.surface}}>
                    {item.quantity}
                  </Text>
                  {item.quantity === 1 ? (
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.food_id)}>
                      <MaterialIcons
                        name="delete-outline"
                        size={20}
                        color={theme.colors.surface}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleDecreaseQuantity(item.food_id)}>
                      <AntDesign
                        name="minus"
                        size={20}
                        color={theme.colors.surface}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={{color: theme.colors.surface, marginTop: 6}}>
                  {item.quantity * item.discount_price} Taka
                </Text>
              </View>
            </View>
            <Image
              source={{uri: `${BaseURL}/${item.image_url[0]}`}}
              style={styles.imageStyle}
              resizeMode="cover"
            />
          </View>
        )}
      />

      <Text style={{color: theme.colors.surface, fontSize: 18, marginTop: 10}}>
        Total: {total.toFixed(2)} Taka
      </Text>
    </ContainerNew>
  );
};
export default Cart;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageStyle: {width: 80, height: 60, marginRight: 10, borderRadius: 8},
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1, // 👈 add this
    borderRadius: 99, // optional
    paddingHorizontal: 6,
    paddingVertical: 4,
    width: 100,
    marginTop: 6,
  },
  boxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
});
