import React from 'react';
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CardMenuType {
  size: number;
  label: string;
  backgroundColor: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

interface Icon {
  iconName: string;
  iconSize?: number;
  iconColor?: string;
}

type CardMenuProps = React.FunctionComponent<CardMenuType> & {
  Icon: React.FC<Icon>;
};

const CardMenu: CardMenuProps = props => {
  const {size, style, label, backgroundColor, onPress, children} = props;
  const {container, content, labelStyle} = styles(backgroundColor, size);

  return (
    <View style={[style, container]}>
      <TouchableOpacity onPress={onPress} style={content}>
        {children}
      </TouchableOpacity>
      <Text style={labelStyle}>{label}</Text>
    </View>
  );
};

const Icon: React.FC<Icon> = ({iconName, iconSize, iconColor}) => {
  const {width} = Dimensions.get('window');

  return (
    <Ionicons
      name={iconName}
      size={iconSize ?? width * 0.1}
      color={iconColor ?? 'white'}
    />
  );
};

const styles = (backgroundColor: string, size: number) => {
  return StyleSheet.create({
    container: {
      width: size,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      width: size,
      height: size,
      backgroundColor,
      borderRadius: 15,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelStyle: {
      paddingHorizontal: 2,
      marginVertical: 4,
      fontSize: 12,
      textAlign: 'center',
    },
  });
};

CardMenu.Icon = Icon;
export default CardMenu;
