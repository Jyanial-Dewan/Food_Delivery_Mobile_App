import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {renderUserName} from '../../common/services/utility';
import CustomButtonNew from '../../common/components/CustomButton';
import {IOrder} from '../../types/OrderTypes';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {BaseURL} from '../../../App';
import {api} from '../../common/apis/api';
import {useSocketContext} from '../../context/SocketContext';
import {removeDeliveryReques} from '../../stores/Redux/Slices/OrderSlice';
const Notification = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {deliveryRequests} = useSelector((state: RootState) => state.order);
  const {users, user} = useSelector((state: RootState) => state.user);
  const {emitAcceptDeliveryRequest} = useSocketContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAcceptRequest = async (order: IOrder) => {
    const api_params = {
      url: `${api.Orders}/accept_delivery_request?order_id=${order.order_id}&delivery_man_id=${user.user_id}`,
      data: {},
      method: 'PUT' as httpMethod,
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const res = await httpRequest(api_params, setIsUpdating);
    if (res.status === 200) {
      emitAcceptDeliveryRequest(order.order_id);
      dispatch(removeDeliveryReques(order));
    }
  };

  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={{color: theme.colors.surface, marginBottom: 10}}>
        Delivery Requests{' '}
      </Text>
      {deliveryRequests?.map(item => (
        <View
          key={`${item.order_id}`}
          style={[
            styles.requestBox,
            {
              borderColor: theme.colors.surface,
              backgroundColor: theme.colors.onBackground,
            },
          ]}>
          <View style={styles.requestRow}>
            <Text style={[styles.labeltext, {color: theme.colors.surface}]}>
              Order Id
            </Text>
            <Text style={[styles.text, {color: theme.colors.surface}]}>
              {item.order_id}
            </Text>
          </View>

          <View style={styles.requestRow}>
            <Text style={[styles.labeltext, {color: theme.colors.surface}]}>
              Payment Method
            </Text>
            <Text style={[styles.text, {color: theme.colors.surface}]}>
              {item.payment_method}
            </Text>
          </View>

          <View style={styles.requestRow}>
            <Text style={[styles.labeltext, {color: theme.colors.surface}]}>
              Payment Status
            </Text>
            <Text style={[styles.text, {color: theme.colors.surface}]}>
              {item.payment_status}
            </Text>
          </View>

          <View style={styles.requestRow}>
            <Text style={[styles.labeltext, {color: theme.colors.surface}]}>
              Pick From
            </Text>
            <Text style={[styles.text, {color: theme.colors.surface}]}>
              {renderUserName(item.vendor_id, users)}
            </Text>
          </View>

          <View style={styles.requestRow}>
            <Text style={[styles.labeltext, {color: theme.colors.surface}]}>
              Delivery To
            </Text>
            <Text style={[styles.text, {color: theme.colors.surface}]}>
              {item.delivery_address}
            </Text>
          </View>
          <CustomButtonNew
            disabled={isUpdating}
            btnText="Accept Request"
            isLoading={isUpdating}
            onBtnPress={() => handleAcceptRequest(item)}
            btnstyle={[styles.btn, {backgroundColor: theme.colors.primary}]}
            btnTextStyle={styles.btnTxt}
          />
        </View>
      ))}
    </ContainerNew>
  );
};
export default Notification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  labeltext: {
    fontWeight: 'bold',
    width: '40%',
  },
  text: {
    width: '60%',
  },
  requestBox: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  requestRow: {flexDirection: 'row', marginBottom: 4},
  btn: {
    borderRadius: 10,
    marginTop: 10,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
