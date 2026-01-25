import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

interface IHeader1Props {
  title: string;
  rightFuncTitle?: string;
  rightFuncIcon?: string;
  rightFuncPress?: () => void;
}

const Header1 = ({
  title,
  rightFuncTitle,
  rightFuncIcon,
  rightFuncPress,
}: IHeader1Props) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity onPress={goBack}>
        <Icon name="arrow-left" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.title, {color: theme.colors.surface}]}>{title}</Text>
      <TouchableOpacity onPress={rightFuncPress}>
        {rightFuncTitle && (
          <Text style={[styles.title, {color: theme.colors.primary}]}>
            {rightFuncTitle}
          </Text>
        )}
        {rightFuncIcon && (
          <Icon name={rightFuncIcon} size={24} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default Header1;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
