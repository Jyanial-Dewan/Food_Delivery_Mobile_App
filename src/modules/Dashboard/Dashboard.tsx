import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import {IOrder} from '../../types/OrderTypes';
import ContainerNew from '../../common/components/Container';
import Modal from './Modal';

const Dashboard = () => {
  const theme = useTheme();
  const {orders, statuses} = useSelector((state: RootState) => state.order);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | undefined>(
    undefined,
  );
  const [status, setStatus] = useState('');
  const ordersByStatus = orders.reduce<Record<string, IOrder[]>>(
    (acc, order) => {
      if (!acc[order.status_code]) {
        acc[order.status_code] = [];
      }
      acc[order.status_code].push(order);
      return acc;
    },
    {},
  );

  const groupedStatuses = statuses.map(status => ({
    ...status,
    orders: ordersByStatus[status.code] || [],
  }));

  const handleOrderPress = (order: IOrder) => {
    setStatus(order.status_code);
    setShowModal(true);
    setSelectedOrder(order);
  };
  return (
    <ContainerNew
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {groupedStatuses.map(s => (
        <View
          key={s.code}
          style={[styles.statusBox, {backgroundColor: s.color}]}>
          <Text style={styles.text}>{s.label}</Text>
          <View style={styles.separator} />
          <View style={styles.orderContainer}>
            {s.orders.map(o => (
              <TouchableOpacity
                onPress={() => handleOrderPress(o)}
                key={o.order_id}
                style={styles.orderBox}>
                <Text style={styles.orderText}>Order Id: {o.order_id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedOrder={selectedOrder}
        status={status}
        setStatus={setStatus}
      />
    </ContainerNew>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBox: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {color: 'black', fontSize: 18, fontWeight: 'bold', marginBottom: 10},
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
});
