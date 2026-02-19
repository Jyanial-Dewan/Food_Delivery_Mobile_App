import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import ContainerNew from '../../common/components/Container';
import {useRoute} from '@react-navigation/native';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {BaseURL} from '../../../App';
import {IFoodItem, IFoodReview} from '../../types/GeneralTypes';
import {useTheme} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {toTitleCase} from '../../common/services/utility';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../stores/Redux/Slices/CartSlice';
import {RootState} from '../../stores/Redux/Store/Store';
import {COLORS} from '../../common/constant/Themes';
import {api} from '../../common/apis/api';
import Spinner from '../../common/components/Spinner';
import Review from './Review';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Column from '../../common/components/Column';
import CustomTextNew from '../../common/components/CustomText';
import CustomInputNew from '../../common/components/CustomInput';
import {useForm} from 'react-hook-form';
import {useToast} from '../../common/components/CustomToast';

const SingleFoodItem = () => {
  const route = useRoute();
  const theme = useTheme();
  const dispatch = useDispatch();
  const toaster = useToast();
  const user = useSelector((state: RootState) => state.user.user);
  const cart = useSelector((state: RootState) => state.cart.cart);
  const {foodId} = route.params as {foodId: number};
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [foodItem, setFoodItem] = useState<IFoodItem | undefined>(undefined);
  const [reviews, setReviews] = useState<IFoodReview[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {width} = Dimensions.get('window');
  const cartIds = cart?.map(item => item.food_id);
  const images = foodItem?.image_urls ?? [];

  //loadFoodiTem
  useEffect(() => {
    const loadFoodItem = async () => {
      const api_params = {
        url: `${api.FoodItem}?food_id=${foodId}`,
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

  //loadReviews
  useEffect(() => {
    const loadReviews = async () => {
      const api_params = {
        url: `${api.FoodReview}?food_id=${foodId}&page=${currentPage}&limit=${limit}`,
        baseURL: BaseURL,
        //   access_token: userInfo?.access_token,
        // isConsole: true,
        // isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setReviews(res.data.result);
    };

    loadReviews();
  }, [currentPage, foodId]);

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

  const sheetRef = useRef<BottomSheet>(null);

  // Snap points from smallest to largest
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Open sheet to first snap point (25%)
  const handleOpenBottomSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChange = useCallback((index: number) => {
    console.log('BottomSheet index:', index);
  }, []);

  const {control, handleSubmit, setValue, reset, formState} = useForm({
    defaultValues: {
      rating: '',
      review: '',
    },
  });
  // const {dirtyFields} = formState;
  // const isFormDirty = Object.keys(dirtyFields).length > 0;

  const onSubmit = async (data: any) => {
    const api_params = {
      url: `${api.FoodReview}`,
      data: {
        user_id: user.user_id,
        food_id: foodId,
        rating: Number(data.rating),
        review: data.review,
      },

      method: 'POST' as httpMethod,
      baseURL: BaseURL,
      // isEncrypted: false,
      isConsole: true,
      isConsoleParams: true,
    };
    // console.log(api_params.data);

    const res = await httpRequest(api_params, setIsLoading);
    if (res.data) {
      reset({
        rating: '',
        review: '',
      });
      toaster.show({message: res?.data?.message, type: 'success'});
    }
  };

  const handleSubmitButton = () => {
    handleSubmit(onSubmit)();
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
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Spinner />
        </View>
      ) : (
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
          {images.length > 0 && (
            <View style={styles.dotsContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        index === activeIndex ? '#007AFF' : '#ccc',
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Rating and Calories Container */}
          <View
            style={[
              styles.ratingContainer,
              {borderColor: theme.colors.surface},
            ]}>
            <View style={styles.ratingStyle}>
              <AntDesign name="star" size={20} color={COLORS.amber} />
              <Text style={{color: theme.colors.surface}}>
                {`${foodItem?.avg_rating} (${foodItem?.review_count})`}
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

          <Text style={[styles.nameText, {color: theme.colors.surface}]}>
            {foodItem?.name}
          </Text>

          <Text style={{color: theme.colors.surface, marginTop: 4}}>
            {foodItem?.description}
          </Text>
          {/* Reviews */}
          <View>
            <Review
              reviews={reviews}
              handleOpenBottomSheet={handleOpenBottomSheet}
            />
          </View>
        </View>
      )}
      {/* BottomSheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1} // fully hidden initially
        snapPoints={snapPoints}
        enablePanDownToClose
        animateOnMount
        onChange={handleSheetChange}
        handleStyle={{
          backgroundColor: theme.colors.primary,
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
        }}>
        <BottomSheetView
          style={[
            styles.contentContainer,
            {backgroundColor: theme.colors.secondary},
          ]}>
          <View style={{gap: 10}}>
            <Column>
              <CustomTextNew
                text="Rating"
                txtSize={16}
                txtWeight={'500'}
                padBottom={10}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="rating"
                label="Enter your rating"
              />
            </Column>
            <Column>
              <CustomTextNew
                text="Review"
                txtSize={16}
                txtWeight={'500'}
                padBottom={10}
              />
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="review"
                label="Enter your review"
              />
            </Column>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleSubmitButton}>
              <Text style={{color: 'white'}}>Submit</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
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
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
    color: COLORS.white,
  },
  sheetSubTitle: {
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.black,
    marginTop: 4,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.red,
    borderRadius: 8,
  },
});
