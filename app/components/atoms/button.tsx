import React from 'react';
import {
  Text,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface Button {
  title: string;
  isHide?: boolean;
  rounded?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Button component
 *
 * @param props.title is a child for button
 * @param props.rounded is boolean status for button is full rounded or not
 * @param props.onPress is a callback when button is pressed
 * @param props.style is a container style for button
 * @param props.textStyle is a style for title button
 */
const Button: React.FC<Button> = props => {
  const {title, rounded, disabled, isHide, style, textStyle, onPress} = props;
  const defaultStyle = buttonStyle(rounded, disabled, isHide);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[defaultStyle.buttonContainer, style]}>
      <Text style={[textStyle, defaultStyle.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const buttonStyle = (
  rounded?: boolean,
  disabled?: boolean,
  isHide?: boolean,
) => {
  return StyleSheet.create({
    buttonContainer: {
      display: isHide ? 'none' : 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-start',
      backgroundColor: disabled ? '#818cf8' : '#6366f1',
      borderRadius: rounded ? 100 : 15,
    },
    text: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 16,
      color: 'white',
      fontWeight: 'bold',
    },
  });
};

export default Button;
