/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, useRef} from 'react';
import {Controller} from 'react-hook-form';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constant/Themes';
import {useTheme} from 'react-native-paper';
import PhoneInput from 'react-native-phone-number-input';
import parsePhoneNumber from 'libphonenumber-js';

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

interface Props {
  control: any;
  name: any;
  rules?: ValidationRules;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  inputMainStyle?: {};
  labelStyle?: {};
  setValue?: any;
  onChange?: any;
  phoneNumber: string;
}

const CustomPhoneNumber = ({
  control,
  name,
  rules,
  placeholder,
  label,
  disabled = false,
  inputMainStyle,
  labelStyle,
  setValue,
  onChange,
  phoneNumber,
}: Props) => {
  const theme = useTheme();
  const phoneInput = useRef<PhoneInput>(null);
  const handleChange = (e: string) => {
    if (onChange) {
      onChange(e);
    } else {
      setValue(name, e, {shouldDirty: true});
    }
  };

  const phone = parsePhoneNumber(phoneNumber);
  const countryCode = phone?.country; // "BD"
  const nationalNumber = phone?.nationalNumber; // "1812111111"
  console.log(countryCode, nationalNumber, 'country code');
  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {value, onBlur, setValue}, fieldState: {error}}) => (
          <>
            <View>
              <View style={[inputMainStyle]}>
                <View style={styles.box}>
                  {/* {value ? (
                    <View>
                      <Text style={[styles.newLabelIOS, labelStyle]}>
                        {label}
                      </Text>
                    </View>
                  ) : null} */}

                  <PhoneInput
                    disabled={disabled}
                    ref={phoneInput}
                    placeholder={placeholder}
                    defaultValue={nationalNumber}
                    defaultCode={(countryCode as any) ?? 'BD'}
                    layout="first"
                    onChangeFormattedText={text => {
                      handleChange(text);
                      // setFormattedValue(text);
                    }}
                    containerStyle={styles.phoneContainer}
                    textInputStyle={styles.phoneTextInput}
                    codeTextStyle={{
                      color: '#757775ff',
                    }}
                    // withDarkTheme
                    // withShadow
                    // autoFocus
                  />
                </View>
              </View>
            </View>

            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />
    </Fragment>
  );
};

export default CustomPhoneNumber;

const styles = StyleSheet.create({
  newLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  newLabelIOS: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.graySubText,
    top: -10,
    position: 'absolute',
    zIndex: 9999,
    marginLeft: 16,
    backgroundColor: 'white',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 16,
  },

  newInput: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: Platform?.OS === 'ios' ? 48 : 40,
    maxHeight: 100,
  },
  newInputIOS: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    // paddingTop: 9,
    // paddingBottom: 14.5,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  disabled: {
    backgroundColor: 'rgba(99, 99, 99,0.1)',
    marginTop: 1.2,
    borderRadius: 6,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  phoneContainer: {
    borderWidth: 1,
    borderColor: COLORS.offDay,
    // height: 50,
    width: '100%',
    paddingHorizontal: 3,
    paddingVertical: 0,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  phoneTextInput: {
    // fontSize: 16,
    // height: 50,
    fontWeight: '500',
    color: '#757775',
    padding: 0,
  },
});
