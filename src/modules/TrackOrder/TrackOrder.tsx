import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ContainerNew from '../../common/components/Container';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {convertDate} from '../../common/services/utility';
import CustomModal from '../../common/components/CustomModal';
import {IOrder, IStatusHistory} from '../../types/OrderTypes';
import {BaseURL} from '../../../App';
import {api} from '../../common/apis/api';
import {httpRequest} from '../../common/constant/httpRequest';
import Spinner from '../../common/components/Spinner';
import Check from '../../assets/Icons/done.png';

const TrackOrder = () => {
  const theme = useTheme();
  const {orders} = useSelector((state: RootState) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [selectedOreder, setSelectedOrder] = useState<IOrder | undefined>(
    undefined,
  );
  const [statusHistory, setStatusHistory] = useState<IStatusHistory[]>([]);
  const [isLoading, setIsLoasing] = useState(false);

  console.log(statusHistory);

  useEffect(() => {
    const loadStatusHistory = async () => {
      const api_params = {
        url: `${api.StatusHistory}?order_id=${selectedOreder?.order_id}`,
        baseURL: BaseURL,
        // isConsole: true,
        // isConsoleParams: true,
      };

      const res = await httpRequest(api_params, setIsLoasing);
      if (res) {
        setStatusHistory(res.data.result);
        console.log(res.data.result);
      }
    };
    loadStatusHistory();
  }, [selectedOreder?.order_id]);

  const handlePressOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.headerText, {color: theme.colors.surface}]}>
        Track Order
      </Text>

      <View style={{gap: 10}}>
        {orders.map(order => (
          <TouchableOpacity
            onPress={() => handlePressOrder(order)}
            key={order.order_id}
            style={{
              backgroundColor: theme.colors.onBackground,
              paddingHorizontal: 8,
              paddingVertical: 5,
              borderRadius: 8,
              gap: 4,
            }}>
            <View style={styles.lineStyle}>
              <Text style={[styles.labelText, {color: theme.colors.surface}]}>
                Order Id
              </Text>
              <Text style={{color: theme.colors.surface}}>
                {order.order_id}
              </Text>
            </View>

            <View style={styles.lineStyle}>
              <Text style={[styles.labelText, {color: theme.colors.surface}]}>
                Ordered at
              </Text>
              <Text style={{color: theme.colors.surface}}>
                {convertDate(order.created_at)}
              </Text>
            </View>

            <View style={styles.lineStyle}>
              <Text style={[styles.labelText, {color: theme.colors.surface}]}>
                Order Items
              </Text>
              {order.order_items.map((item, index) => (
                <Text key={item.food_id} style={{color: theme.colors.surface}}>
                  {index + 1}. {item.food_name} x {item.quantity}
                </Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <CustomModal showModal={showModal} setShowModal={setShowModal}>
        {isLoading ? (
          <Spinner size={40} color="black" />
        ) : (
          <View>
            {statusHistory?.map((item, index) => (
              <View key={item.history_id} style={{paddingHorizontal: 4}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image style={{width: 25, height: 25}} source={Check} />
                  <Text style={{color: 'black'}}>
                    You order is {item.status_code}{' '}
                    {index !== 0 && `at ${convertDate(item.changed_at)}`}
                  </Text>
                </View>
                {index <= statusHistory.length - 2 && (
                  <View
                    style={{
                      height: 30,
                      width: 3,
                      backgroundColor: 'black',
                      marginLeft: 8,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </CustomModal>
    </ContainerNew>
  );
};
export default TrackOrder;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelText: {
    fontWeight: 'bold',
    width: '30%',
  },
  lineStyle: {flexDirection: 'row', alignItems: 'center'},
});
