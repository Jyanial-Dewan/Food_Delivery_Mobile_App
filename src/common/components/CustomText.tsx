import React, {Fragment} from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS} from '../constant/Themes';
import {useTheme} from 'react-native-paper';

interface Props extends React.ComponentProps<typeof Text> {
  text?: string | number;
  txtColor?: string;
  txtStyle?: {};
  subTxt?: boolean;
  txtWeight?: any;
  txtSize?: number;
  lineHight?: number;
  txtAlign?: any;
  padTop?: number;
  padLeft?: number;
  fontFamily?: string;
  lefIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  textDecorationStyle?: any;
  textDecorationLine?: any;
  padBottom?: number;
}

const CustomTextNew: React.FC<Props> = ({
  text = '',
  txtStyle,
  subTxt = false,
  txtWeight = '400',
  txtSize = 14,
  txtAlign = 'auto',
  lineHight,
  txtColor,
  padTop,
  padBottom,
  padLeft,
  fontFamily,
  lefIcon,
  rightIcon,
  textDecorationStyle,
  textDecorationLine,
  ...otherProps
}: Props) => {
  const theme = useTheme();
  return (
    <Fragment>
      {text ? (
        <Fragment>
          {rightIcon}
          <Text
            style={[
              styles.txt,
              txtStyle || {
                color: theme.colors.surface,
                fontWeight: txtWeight,
                fontSize: txtSize,
                textAlign: txtAlign,
                lineHeight: lineHight,
                paddingTop: padTop,
                paddingBottom: padBottom,
                paddingLeft: padLeft,
                fontFamily: fontFamily,
                textDecorationStyle: textDecorationStyle,
                textDecorationLine: textDecorationLine,
              },
            ]}
            {...otherProps}>
            {text?.toString()?.trim()}
          </Text>
          {lefIcon}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default CustomTextNew;

const styles = StyleSheet.create({
  txt: {
    color: COLORS.textNewColor,
  },
});
