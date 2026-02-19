declare module 'react-native-vector-icons/*' {
  import * as React from 'react';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<any>
  >;

  export default Icon;
}
