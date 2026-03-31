import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {IOrder, IOrderStatus} from '../../types/OrderTypes';
import ContainerNew from '../../common/components/Container';
import SelectDropdown from 'react-native-select-dropdown';
import {convertDate, renderUserName} from '../../common/services/utility';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {api} from '../../common/apis/api';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {BaseURL} from '../../../App';
import Spinner from '../../common/components/Spinner';
import {useSocketContext} from '../../context/SocketContext';
import {useToast} from '../../common/components/CustomToast';

const Dashboard = () => {
  const {emitUpdateStatus} = useSocketContext();
  const theme = useTheme();
  const toaster = useToast();
  const {orders} = useSelector((state: RootState) => state.order);
  const {users, user} = useSelector((state: RootState) => state.user);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | undefined>(
    undefined,
  );
  const [status, setStatus] = useState('');
  const [statuses, setStatuses] = useState<IOrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const groupedStatuses = Object.values(
    (orders || []).reduce<
      Record<string, {status_code: string; orders: IOrder[]}>
    >((acc, order) => {
      if (!acc[order.status_code]) {
        acc[order.status_code] = {
          status_code: order.status_code,
          orders: [],
        };
      }

      acc[order.status_code].orders.push(order);

      return acc;
    }, {}),
  );

  useEffect(() => {
    const loadStatuses = async () => {
      const api_params = {
        url: `${api.OrderStatuses}?vendor_id=${selectedOrder?.vendor_id}`,
        baseURL: BaseURL,
      };

      const res = await httpRequest(api_params, setIsLoading);
      console.log(res);
      const dynamicStatuses = res.data.result.status_names as IOrderStatus[];

      const availableStatuses = dynamicStatuses.filter(
        item => item.available_for === user.user_type,
      );
      setStatuses(availableStatuses || []);
    };

    loadStatuses();
  }, [selectedOrder?.vendor_id, user.user_type]);

  const handleUpdateStatus = async (orderId: number) => {
    const api_params = {
      url: `${api.Orders}?order_id=${orderId}`,
      data: {status_code: status, user_id: user.user_id},
      method: 'PUT' as httpMethod,
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const res = await httpRequest(api_params, setIsUpdating);
    if (res.status === 200) {
      emitUpdateStatus(orderId);
      toaster.show({message: res?.data?.message, type: 'success'});
      const pushNotificationParams = {
        url: `${api.PushNotification}/send_status_update`,
        data: {order_id: orderId},
        method: 'POST' as httpMethod,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      await httpRequest(pushNotificationParams, setIsUpdating);
    }
  };

  // const handleOrderPress = (order: IOrder) => {
  //   setStatus(order.status_code);
  //   setShowModal(true);
  //   setSelectedOrder(order);
  // };
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {groupedStatuses.map(
        s =>
          s?.orders?.length > 0 && (
            <View key={s.status_code} style={[styles.statusBox]}>
              <Text>
                {s.status_code} ({s.orders.length})
              </Text>
              {s.orders.map(item => (
                <TouchableOpacity
                  onPress={() => setSelectedOrder(item)}
                  key={item.order_id}
                  style={{
                    backgroundColor: theme.colors.onBackground,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    borderRadius: 8,
                  }}>
                  <View style={styles.textContainer}>
                    <Text
                      style={[styles.labelText, {color: theme.colors.surface}]}>
                      Order Id
                    </Text>
                    <Text style={[styles.text, {color: theme.colors.surface}]}>
                      {item.order_id}
                    </Text>
                  </View>
                  {selectedOrder?.order_id === item.order_id && (
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.labelText,
                          {color: theme.colors.surface},
                        ]}>
                        Order Items
                      </Text>
                      <View>
                        {item.order_items.map((item, index) => (
                          <Text
                            style={[styles.text, {color: theme.colors.surface}]}
                            key={item.order_item_id}>{`${index + 1}. ${
                            item.food_name
                          } X ${item.quantity}`}</Text>
                        ))}
                      </View>
                    </View>
                  )}
                  <View style={styles.textContainer}>
                    <Text
                      style={[styles.labelText, {color: theme.colors.surface}]}>
                      Customer
                    </Text>
                    <Text style={[styles.text, {color: theme.colors.surface}]}>
                      {item.customer_id
                        ? renderUserName(item.customer_id, users)
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.textContainer}>
                    <Text
                      style={[styles.labelText, {color: theme.colors.surface}]}>
                      Address
                    </Text>
                    <Text style={[styles.text, {color: theme.colors.surface}]}>
                      {item.delivery_address}
                    </Text>
                  </View>
                  {selectedOrder?.order_id === item.order_id && (
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.labelText,
                          {color: theme.colors.surface},
                        ]}>
                        Note
                      </Text>
                      <Text
                        style={[styles.text, {color: theme.colors.surface}]}>
                        {item.notes}
                      </Text>
                    </View>
                  )}

                  {selectedOrder?.order_id === item.order_id && (
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.labelText,
                          {color: theme.colors.surface},
                        ]}>
                        Total Amount
                      </Text>
                      <Text
                        style={[styles.text, {color: theme.colors.surface}]}>
                        {item.total_amount}
                      </Text>
                    </View>
                  )}
                  <View style={styles.textContainer}>
                    <Text
                      style={[styles.labelText, {color: theme.colors.surface}]}>
                      Payment Method
                    </Text>
                    <Text style={[styles.text, {color: theme.colors.surface}]}>
                      {item.payment_method}
                    </Text>
                  </View>
                  {selectedOrder?.order_id === item.order_id && (
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.labelText,
                          {color: theme.colors.surface},
                        ]}>
                        Ordered At
                      </Text>
                      <Text
                        style={[styles.text, {color: theme.colors.surface}]}>
                        {item.created_at ? convertDate(item.created_at) : ''}
                      </Text>
                    </View>
                  )}
                  {selectedOrder?.order_id === item.order_id && (
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.labelText,
                          {color: theme.colors.surface},
                        ]}>
                        Status
                      </Text>
                      <SelectDropdown
                        data={statuses}
                        disabled={isLoading}
                        onSelect={selectedItem => {
                          setStatus(selectedItem.code);
                        }}
                        renderButton={(selectedItem, isOpened) => (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {selectedItem?.label || status || 'Select status'}
                            </Text>

                            <Icon
                              name={isOpened ? 'chevron-up' : 'chevron-down'}
                              style={styles.dropdownButtonArrowStyle}
                              color="black"
                            />
                          </View>
                        )}
                        renderItem={(item, index, isSelected) => {
                          return (
                            <View
                              style={[
                                styles.dropdownItemStyle,
                                isSelected && {backgroundColor: '#e6e6e6'},
                              ]}>
                              <Text style={styles.dropdownItemTxtStyle}>
                                {item.label}
                              </Text>
                            </View>
                          );
                        }}
                        dropdownStyle={styles.dropdownMenuStyle}
                        showsVerticalScrollIndicator={false}
                      />
                    </View>
                  )}
                  {selectedOrder?.order_id === item.order_id && (
                    <TouchableOpacity
                      disabled={isUpdating}
                      onPress={() =>
                        handleUpdateStatus(selectedOrder?.order_id as number)
                      }
                      style={[
                        styles.updateButton,
                        {
                          backgroundColor: theme.colors.primary,
                          opacity: isUpdating ? 0.2 : 1,
                        },
                      ]}>
                      {isUpdating ? (
                        <Spinner />
                      ) : (
                        <Text style={styles.updateButtonText}>
                          Update Status{' '}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ),
      )}
    </ContainerNew>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBox: {
    gap: 10,
    marginBottom: 10,
  },
  orderText: {color: 'black'},
  separator: {
    backgroundColor: 'black',
    height: 1,
    width: '100%',
    marginBottom: 10,
  },
  orderContainer: {gap: 10},
  orderBox: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  labelText: {
    color: 'black',
    fontWeight: 'bold',
    width: '25%',
  },
  text: {
    color: 'black',
  },
  textContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  dropdownItemTxtStyle: {
    // flex: 1,
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  updateButton: {
    width: '100%',
    height: 40,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {color: 'white', fontWeight: '600'},
});
