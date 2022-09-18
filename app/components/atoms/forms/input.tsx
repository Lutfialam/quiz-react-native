import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleProp,
  TextInput,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';

interface Input extends React.ComponentProps<typeof TextInput> {
  name: string;
  label?: string;
  value?: string;
  error?: string;
  borderLess?: boolean;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onInputChange: (name: string, value: string) => void;
}

interface StyleState {
  labelColor: string;
  borderWidth: number;
  borderColor: string;
}

const Input: React.FC<Input> = props => {
  const {
    name,
    value,
    error,
    label,
    borderLess,
    style,
    containerStyle,
    onInputChange,
    ...rest
  } = props;

  const [inputStyle, setInputStyle] = useState<StyleState>({} as StyleState);

  const defaultStyle = styles(inputStyle);
  const onFocus = () => {
    setInputStyle({...inputStyle, borderColor: colors.primary});
  };

  const onBlur = () => {
    setInputStyle({...inputStyle, borderColor: colors.border});
  };

  useEffect(() => {
    const isError = error && error.length > 0;

    setInputStyle({
      borderWidth: borderLess ? 0 : 1,
      borderColor: isError ? colors.red : colors.border,
      labelColor: isError ? colors.red : colors.secondary,
    });
  }, [props]);

  return (
    <View style={[defaultStyle.container, containerStyle]}>
      {label && <Text style={defaultStyle.label}>{label}</Text>}
      <TextInput
        {...rest}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        style={[defaultStyle.input, style]}
        multiline={props.multiline ?? true}
        onChangeText={text => {
          onInputChange(name, text);
        }}
      />
      {error && <Text style={defaultStyle.error}>{error}</Text>}
    </View>
  );
};

const styles = (style: StyleState) => {
  return StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: 4,
      color: style.labelColor,
    },
    error: {
      color: colors.red,
    },
    input: {
      paddingLeft: 10,
      backgroundColor: 'white',
      borderWidth: style.borderWidth,
      borderColor: style.borderColor,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
};

const colors = {
  primary: '#6366f1',
  secondary: '#6b7280',
  border: '#e2e8f0',
  red: '#ef4444',
};

export default Input;
