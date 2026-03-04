import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {IOrderStatus} from '../../types/OrderTypes';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {ICartItem} from '../../types/CartTypes';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {useToast} from '../../common/components/CustomToast';
import {useSocketContext} from '../../context/SocketContext';
import {changeCardReloadController} from '../../stores/Redux/Slices/CartSlice';
import ContainerNew from '../../common/components/Container';
import {useForm, Controller} from 'react-hook-form';
import Column from '../../common/components/Column';
import CustomTextNew from '../../common/components/CustomText';
import CustomInputNew from '../../common/components/CustomInput';
import {useTheme} from 'react-native-paper';
import CustomButtonNew from '../../common/components/CustomButton';
import SelectDropdown from 'react-native-select-dropdown';

interface GroupedCart {
  vendor_id: number;
  items: ICartItem[];
}

const PlaceOrder = () => {
  const {cart} = useSelector((state: RootState) => state.cart);
  const {user} = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const toaster = useToast();
  const theme = useTheme();
  const {emitAddOrder} = useSocketContext();

  const groupedByVendor = Object.values(
    cart.reduce<Record<number, GroupedCart>>((acc, item) => {
      if (!acc[item.vendor_id]) {
        acc[item.vendor_id] = {
          vendor_id: item.vendor_id,
          items: [],
        };
      }

      acc[item.vendor_id].items.push(item);
      return acc;
    }, {}),
  );
  const loadStatuses = async (vendorId: number) => {
    const api_params = {
      url: `${api.OrderStatuses}?vendor_id=${vendorId}`,
      baseURL: BaseURL,
    };

    const res = await httpRequest(api_params, setIsLoading);

    if (res) {
      const statuses = res.data.result.status_names as IOrderStatus[];
      return statuses.find(item => item.position === 1)?.code;
    }
  };

  const paymentMethods = ['Cash on Delivery', 'Bkash', 'Nagad', 'Card'];

  const {control, handleSubmit, setValue, reset, formState} = useForm({
    defaultValues: {
      payment_method: '',
      delivery_address: '',
      notes: '',
    },
  });

  const onSubmit = async (data: any) => {
    for (const vendor of groupedByVendor) {
      await loadStatuses(vendor.vendor_id);
      const payload = {
        customer_id: user.user_id,
        vendor_id: vendor.vendor_id,
        payment_method: data.payment_method,
        delivery_address: data.delivery_address,
        notes: data.notes,
        status_code: await loadStatuses(vendor.vendor_id),
      };
      const params = {
        url: api.Orders,
        data: payload,
        method: 'POST' as httpMethod,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const orderRes = await httpRequest(params, setIsLoading);
      if (orderRes.status === 201) {
        for (const orderItem of vendor.items) {
          const orderItemPayload = {
            order_id: orderRes.data.result.order_id,
            food_id: orderItem.food_id,
            quantity: orderItem.quantity,
            subtotal: orderItem.quantity * orderItem.discount_price,
          };
          const orderItemParams = {
            url: api.OrderItems,
            data: orderItemPayload,
            method: 'POST' as httpMethod,
            baseURL: BaseURL,
            // isConsole: true,
            // isConsoleParams: true,
          };

          const deleteCartParams = {
            url: `${api.CartItems}?user_id=${orderItem.user_id}&food_id=${orderItem.food_id}`,
            method: 'DELETE' as httpMethod,
            baseURL: BaseURL,
            // isConsole: true,
            // isConsoleParams: true,
            // access_token: userInfo?.access_token,
          };

          await httpRequest(orderItemParams, setIsLoading);
          emitAddOrder(orderRes.data.result.order_id as number);
          await httpRequest(deleteCartParams, setIsLoading);
          dispatch(changeCardReloadController());
          toaster.show({message: orderRes?.data?.message, type: 'success'});
          reset();
        }
      }
    }
  };
  return (
    <ContainerNew
      footer={
        <CustomButtonNew
          disabled={isLoading}
          btnText="Place order"
          isLoading={isLoading}
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={[styles.btn, {backgroundColor: theme.colors.primary}]}
          btnTextStyle={styles.btnTxt}
        />
      }>
      <View style={{gap: 10}}>
        <Column>
          <CustomTextNew
            text="Payment Method"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
          />

          <Controller
            control={control}
            name="payment_method"
            rules={{required: 'Payment method is required'}}
            render={({field: {onChange, value}}) => (
              <SelectDropdown
                data={paymentMethods}
                onSelect={selectedItem => {
                  onChange(selectedItem);
                }}
                renderButton={(selectedItem, isOpened) => (
                  <View
                    style={{
                      height: 50,
                      borderWidth: 1,
                      borderRadius: 8,
                      justifyContent: 'center',
                      paddingHorizontal: 12,
                      borderColor: theme.colors.surface,
                    }}>
                    <Text>{selectedItem ?? 'Select payment method'}</Text>
                  </View>
                )}
                renderItem={(item, index, isSelected) => (
                  <View
                    style={{
                      padding: 12,
                      backgroundColor: isSelected
                        ? theme.colors.background
                        : theme.colors.onBackground,
                    }}>
                    <Text>{item}</Text>
                  </View>
                )}
              />
            )}
          />
        </Column>
        <Column>
          <CustomTextNew
            text="Delivery Address"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="delivery_address"
            label="Enter your delivery address"
          />
        </Column>
        <Column>
          <CustomTextNew
            text="Note"
            txtSize={16}
            txtWeight={'500'}
            padBottom={10}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="notes"
            label="Enter your notes"
          />
        </Column>
      </View>
    </ContainerNew>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    marginBottom: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
