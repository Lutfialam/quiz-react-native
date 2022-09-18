import React from 'react';
import {View} from 'react-native';

interface Divider {
  width?: number;
  height?: number;
  color?: string;
}

const Divider: React.FC<Divider> = props => {
  const {width, height, color} = props;

  return (
    <View
      style={{
        marginVertical: 10,
        width: width ?? '100%',
        borderWidth: height ?? 2,
        borderColor: color ?? '#e2e8f0',
        borderRadius: 100,
      }}></View>
  );
};

export default Divider;
