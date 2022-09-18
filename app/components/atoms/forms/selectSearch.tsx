import React, {useRef, useState} from 'react';
import {
  Text,
  View,
  Modal,
  StyleProp,
  TextInput,
  TextStyle,
  ViewStyle,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

export interface SelectSearchValue {
  id: number;
  value: string;
}

interface SelectSearch extends React.ComponentProps<typeof TextInput> {
  label?: string;
  error?: string;
  isLoading?: boolean;
  data: SelectSearchValue[];
  selected?: SelectSearchValue;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onSelected: (item: SelectSearchValue) => void;
  onChangeText?: (item: string) => void;
}

interface StyleState {
  labelColor: string;
  borderColor: string;
}

interface Position {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  px?: number;
  py?: number;
}

const SelectSearch: React.FC<SelectSearch> = props => {
  const {
    data,
    label,
    style,
    error,
    selected,
    isLoading,
    onSelected,
    onChangeText,
    containerStyle,
    ...rest
  } = props;

  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [inputStyle, setInputStyle] = useState<StyleState>({} as StyleState);
  const [modalPosition, setModalPosition] = useState<Position>({} as Position);
  const [selectedValue, setSelectedValue] = useState<SelectSearchValue | null>(
    null,
  );

  const inputRef = useRef() as React.RefObject<TextInput>;
  const modalInputRef = useRef() as React.RefObject<TextInput>;
  const defaultStyle = styles(inputStyle, modalPosition);

  const onFocus = () => {
    setInputStyle({...inputStyle, borderColor: colors.primary});
  };

  const onBlur = () => {
    setInputStyle({...inputStyle, borderColor: colors.border});
  };

  const onSearch = (text: string) => {
    setSearch(text);
    onChangeText && onChangeText(text);
  };

  const openModal = () => {
    inputRef?.current?.measure((x, y, w, h, px, py) => {
      setModalPosition({x, y, w, h, px, py});
      setVisible(true);
      inputRef.current?.blur();
      modalInputRef.current?.blur();
      modalInputRef.current?.focus();
    });
  };

  const closeModal = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    const isError = error && error.length > 0;

    setInputStyle({
      borderColor: isError ? colors.red : colors.border,
      labelColor: isError ? colors.red : colors.secondary,
    });

    if (selectedValue == null) {
      setSearch(selected?.value ?? '');
      setSelectedValue(selected ?? data[0]);
    }
  }, [props]);

  return (
    <KeyboardAvoidingView>
      <View style={[containerStyle, defaultStyle.container]}>
        {label && <Text style={defaultStyle.label}>{label}</Text>}
        <View
          style={[
            style,
            defaultStyle.containerInput,
            {display: visible ? 'none' : 'flex'},
          ]}>
          <TextInput
            {...rest}
            value={search}
            ref={inputRef}
            onBlur={onBlur}
            onFocus={openModal}
            spellCheck={false}
            style={defaultStyle.input}
            multiline={props.multiline ?? true}
          />
          <Text onPress={onFocus}>Select</Text>
        </View>

        <Modal transparent animationType="fade" visible={visible}>
          <View style={defaultStyle.overlay}>
            <View style={[style, defaultStyle.containerModalInput]}>
              <TextInput
                {...rest}
                value={search}
                ref={modalInputRef}
                onBlur={onBlur}
                onFocus={onFocus}
                spellCheck={false}
                style={defaultStyle.modalInput}
                multiline={props.multiline ?? true}
                onChangeText={onSearch}
              />
              <Text onPress={onFocus}>Select</Text>
            </View>
            <View style={defaultStyle.content}>
              <ScrollView>
                {!isLoading ? (
                  data.map((item, index) => (
                    <Text
                      key={index}
                      style={defaultStyle.selectItem}
                      onPress={() => {
                        closeModal();
                        setSearch(item.value);
                        onSelected(item);
                      }}>
                      {item.value}
                    </Text>
                  ))
                ) : (
                  <Text>Loading ...</Text>
                )}
              </ScrollView>
              <TouchableOpacity
                onPress={closeModal}
                style={defaultStyle.cancelContainer}>
                <Text style={defaultStyle.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {error && <Text style={defaultStyle.error}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = (style: StyleState, position: Position) => {
  const {width: windowWidth, height: windowHeight} = Dimensions.get('window');
  const {height: screenHeight} = Dimensions.get('screen');

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
    containerInput: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderWidth: 1,
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
    input: {
      width: windowWidth * 0.8,
    },
    containerModalInput: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: style.borderColor,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      top: position.py as number,
      left: (position.px as number) / 2,
    },
    modalInput: {
      zIndex: 50,
      width: windowWidth * 0.8,
    },
    content: {
      position: 'absolute',
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      borderRadius: 10,
      padding: 10,
      zIndex: 30,
      width: windowWidth - (position.px as number),
      left: (position.px as number) / 2,
      top: (position.h as number) + (position.py as number) + 5,
      maxHeight: screenHeight * 0.3,
      opacity: 1,
    },
    selectItem: {
      width: windowWidth,
      marginVertical: 10,
      fontSize: 16,
    },
    overlay: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cancelContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 4,
    },
    cancelText: {
      paddingVertical: 5,
      paddingHorizontal: 15,
      backgroundColor: colors.secondary,
      color: 'white',
      borderRadius: 100,
    },
  });
};

const colors = {
  primary: '#6366f1',
  secondary: '#6b7280',
  border: '#e2e8f0',
  red: '#ef4444',
};

export default SelectSearch;
