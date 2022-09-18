import React from 'react';
import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';

interface Card {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  background?: string;
  onPress?: () => void;
  children: React.ReactNode;
}

const Card: React.FC<Card> = props => {
  const {width, height, style, background, onPress, children} = props;
  const styles = cardStyle(background, width, height);

  return (
    <TouchableOpacity style={[style, styles.container]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const cardStyle = (background?: string, width?: number, height?: number) => {
  return StyleSheet.create({
    container: {
      width,
      height,
      padding: 10,
      borderRadius: 15,
      backgroundColor: background ?? 'white',
    },
  });
};

export default Card;
