import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomModal from '../../common/components/CustomModal';
import {IOrder, IOrderStatus} from '../../types/OrderTypes';
import {convertDate, renderUserName} from '../../common/services/utility';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/Redux/Store/Store';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {api} from '../../common/apis/api';
import {BaseURL} from '../../../App';
import {httpMethod, httpRequest} from '../../common/constant/httpRequest';
import {useSocketContext} from '../../context/SocketContext';
import Spinner from '../../common/components/Spinner';

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: IOrder | undefined;
  status: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const Modal = ({
  setShowModal,
  showModal,
  selectedOrder,
  status,
  setStatus,
}: Props) => {
  const {users, user} = useSelector((state: RootState) => state.user);
  const [statuses, setStatuses] = useState<IOrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const {emitUpdateStatus} = useSocketContext();

  console.log(statuses);

  useEffect(() => {
    const loadStatuses = async () => {
      const api_params = {
        url: `${api.OrderStatuses}?vendor_id=${selectedOrder?.vendor_id}`,
        baseURL: BaseURL,
      };

      const res = await httpRequest(api_params, setIsLoading);
      setStatuses(res.data.result);
    };

    loadStatuses();
  }, [selectedOrder?.vendor_id]);

  const handleUpdateStatus = async (orderId: number) => {
    const api_params = {
      url: `${api.Orders}?order_id=${orderId}`,
      data: {status_code: status},
      method: 'PUT' as httpMethod,
      baseURL: BaseURL,
      // isConsole: true,
      // isConsoleParams: true,
    };

    const res = await httpRequest(api_params, setIsUpdating);
    if (res.status === 200) {
      emitUpdateStatus(orderId);
      setShowModal(false);
    }
  };
  return (
    <CustomModal showModal={showModal} setShowModal={setShowModal}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Order Id</Text>
          <Text style={styles.text}>{selectedOrder?.order_id}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Order Items</Text>
          <View>
            {selectedOrder?.order_items.map((item, index) => (
              <Text style={styles.text} key={item.order_item_id}>{`${
                index + 1
              }. ${item.food_name} X ${item.quantity}`}</Text>
            ))}
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Customer</Text>
          <Text style={styles.text}>
            {selectedOrder?.customer_id
              ? renderUserName(selectedOrder?.customer_id, users)
              : ''}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Address</Text>
          <Text style={styles.text}>{selectedOrder?.delivery_address}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Note</Text>
          <Text style={styles.text}>{selectedOrder?.notes}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Total Amount</Text>
          <Text style={styles.text}>{selectedOrder?.total_amount}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Payment Method</Text>
          <Text style={styles.text}>{selectedOrder?.payment_method}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Ordered At</Text>
          <Text style={styles.text}>
            {selectedOrder?.created_at
              ? convertDate(selectedOrder?.created_at)
              : ''}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.labelText}>Status</Text>
          <SelectDropdown
            data={statuses}
            disabled={isLoading}
            onSelect={selectedItem => {
              if (selectedItem.av) return;
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
                  <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
                </View>
              );
            }}
            dropdownStyle={styles.dropdownMenuStyle}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity
          disabled={isUpdating}
          onPress={() => handleUpdateStatus(selectedOrder?.order_id as number)}
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
            <Text style={styles.updateButtonText}>Update Status </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </CustomModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
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
