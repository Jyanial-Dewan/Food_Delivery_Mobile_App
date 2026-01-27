import React, {Fragment, useState} from 'react';
import {Controller} from 'react-hook-form';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../constant/Themes';
interface ValidationRules {
  required?: boolean | string | {value: boolean; message: string};
  pattern?: {value: RegExp; message: string};
  minLength?: {value: number; message: string};
  maxLength?: {value: number; message: string};
  min?: {value: number; message: string};
  max?: {value: number; message: string};
  validate?: {[key: string]: (value: any) => boolean | string};
  valueAsNumber?: boolean;
  valueAsDate?: boolean;
  disabled?: boolean;
}
type Option = {
  label: any;
  value: any;
};

type SelectProps = {
  control: any;
  rules?: ValidationRules;
  options: Option[];
  name: any;
  onSelect: any;
  placeholder?: any;
  disable?: boolean;
};

const Select: React.FC<SelectProps> = ({
  control,
  rules,
  options,
  name,
  onSelect,
  placeholder = 'Select an option',
  disable = false,
}) => {
  const [visible, setVisible] = useState(false);

  const handleChange = (e: string | number) => {
    onSelect(name, e, {shouldDirty: true});
  };
  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value}, fieldState: {error}}) => {
          const selectedLabel = options.find(o => o.value === value)?.label;
          return (
            <>
              <>
                <TouchableOpacity
                  disabled={options.length === 0 || disable}
                  style={[
                    styles.selectBox,
                    options.length === 0 && {opacity: 0.5},
                    {opacity: disable ? 0.5 : 1},
                  ]}
                  onPress={() => setVisible(true)}>
                  <Text style={styles.text}>
                    {selectedLabel || placeholder}
                  </Text>
                  <Icon name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="fade">
                  <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setVisible(false)}>
                    <View style={styles.modal}>
                      <FlatList
                        data={options}
                        keyExtractor={item => String(item.value)}
                        renderItem={({item, index}) => (
                          <TouchableOpacity
                            style={[
                              styles.option,
                              {
                                borderBottomWidth:
                                  index === options.length - 1 ? 0 : 1,
                              },
                            ]}
                            onPress={() => {
                              handleChange(item.value);
                              // onSelect(name, item.value);
                              setVisible(false);
                            }}>
                            <Text style={styles.text}>{item.label}</Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </>

              {error && <Text style={styles.error}>{error.message}</Text>}
            </>
          );
        }}
      />
    </Fragment>
  );
};

export default Select;
const styles = StyleSheet.create({
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    textAlignVertical: 'center',
    minHeight: Platform?.OS === 'ios' ? 48 : 40,
    maxHeight: 100,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 300,
  },
  option: {
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 16,
  },
});
