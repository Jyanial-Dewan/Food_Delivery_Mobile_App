import {StyleSheet, View} from 'react-native';
import React, {Fragment} from 'react';
import {COLORS} from '../constant/Themes';
import BellIcon from '../../assets/Icons/bell.svg';
import UserIcon from '../../assets/Icons/user.svg';
import SettingIcon from '../../assets/Icons/settings.svg';

interface SVGControllerProps {
  name: string;
  height?: number;
  width?: number;
  color?: string;
}

const SVGController = ({
  name,
  height = 24,
  width = 24,
  color = COLORS.newGray,
}: SVGControllerProps) => {
  const getSVGImage = (
    svgName: string,
    width: number,
    height: number,
    color: string,
  ): any => {
    switch (svgName) {
      case 'Bell':
        return <BellIcon width={width} height={height} color={color} />;
      case 'User':
        return <UserIcon width={width} height={height} color={color} />;
      case 'Settings':
        return <SettingIcon width={width} height={height} color={color} />;
      default:
        return <BellIcon width={width} height={height} color={color} />;
    }
  };
  return (
    <Fragment>
      <View style={styles.container}>
        {getSVGImage(name, height, width, color)}
      </View>
    </Fragment>
  );
};

export default SVGController;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.transparent,
    borderRadius: 100,
  },
});
