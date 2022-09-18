import React, {createContext, useContext, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Alignment = 'center' | 'left' | 'right';

interface ChildrenProps {
  visible: {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
  styles: any;
  toggleModal: () => void;
  modalPosition: Position;
  dropdownRef?: React.RefObject<TouchableOpacity>;
}

interface Dropdown {
  label?: string;
  selected?: {id: number; value: string};
  onSelect?: () => void;
  position?: Alignment;
  children: React.ReactNode;
}

interface DropdownItem {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode | string;
}

interface DropdownContent {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface DropdownButton {
  children: React.ReactNode;
}

interface Position {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  px?: number;
  py?: number;
}

type DropdownType = React.FunctionComponent<Dropdown> & {
  Item: React.FC<DropdownItem>;
  Button: React.FC<DropdownButton>;
  Content: React.FC<DropdownContent>;
};

const DropdownContext = createContext<ChildrenProps>({} as ChildrenProps);

const Dropdown: DropdownType = ({position = 'left', children}) => {
  const defaultPosition = {x: 0, y: 0, w: 0, h: 0, px: 0, py: 0};
  const dropdownRef = useRef() as React.RefObject<TouchableOpacity>;

  const [visible, setVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState<Position>(defaultPosition);

  const toggleModal = () => {
    dropdownRef?.current?.measure((x, y, w, h, px, py) => {
      setModalPosition({x, y, w, h, px, py});
    });
    visible ? setVisible(false) : setVisible(true);
  };

  const styles = defaultStyles(modalPosition, position);

  return (
    <DropdownContext.Provider
      value={{
        styles,
        toggleModal,
        dropdownRef,
        modalPosition,
        visible: {visible, setVisible},
      }}>
      <TouchableOpacity ref={dropdownRef} onPress={toggleModal}>
        {children}
      </TouchableOpacity>
    </DropdownContext.Provider>
  );
};

const Content: React.FC<DropdownContent> = ({style: propStyle, children}) => {
  const {visible, styles, toggleModal} = useContext(DropdownContext);

  return (
    <Modal transparent visible={visible.visible}>
      <TouchableOpacity style={styles.overlay} onPress={toggleModal}>
        <View style={[propStyle, styles.content]}>{children}</View>
      </TouchableOpacity>
    </Modal>
  );
};

const Item: React.FC<DropdownItem> = ({onPress, style, children}) => {
  const {styles} = useContext(DropdownContext);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      {typeof children == 'string' ? <Text>{children}</Text> : children}
    </TouchableOpacity>
  );
};

const Button: React.FC<DropdownButton> = ({children}) => {
  const {toggleModal, styles} = useContext(DropdownContext);

  return (
    <Pressable style={[styles.button]} onPress={toggleModal}>
      {children}
    </Pressable>
  );
};

const defaultStyles = (position: Position, x: Alignment) => {
  const {width} = Dimensions.get('window');
  return StyleSheet.create({
    overlay: {
      width: '100%',
      height: '100%',
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
      zIndex: 40,
      [x]: width - (position.px as number) - (position.w as number),
      top: (position.h as number) + (position.py as number),
    },
    item: {
      marginVertical: 4,
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

Dropdown.Content = Content;
Dropdown.Item = Item;
Dropdown.Button = Button;
export default Dropdown;
