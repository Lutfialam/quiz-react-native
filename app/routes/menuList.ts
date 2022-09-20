import colors from '@/assets/styles/colors';
import {Dimensions} from 'react-native';
import {navigate} from './rootNavigation';

interface CardMenuType {
  size: number;
  label: string;
  roles: string[];
  backgroundColor: string;
  onPress: () => void;
  iconName: string;
}

const listMenu = (): CardMenuType[] => {
  const size = Dimensions.get('window').width * 0.155;

  return [
    {
      size,
      roles: ['admin'],
      iconName: 'create',
      label: 'Create quiz',
      backgroundColor: colors.green,
      onPress: () => navigate('quiz_create'),
    },
    {
      size,
      roles: ['admin'],
      iconName: 'newspaper',
      label: 'Show quiz entries',
      backgroundColor: colors.primary,
      onPress: () => navigate('quiz_entries'),
    },
    {
      size,
      roles: ['all'],
      iconName: 'reader',
      label: 'Show categories',
      backgroundColor: colors.yellow,
      onPress: () => {},
    },
    {
      size,
      roles: ['admin'],
      iconName: 'person-circle',
      label: 'Show user entries',
      backgroundColor: colors.red,
      onPress: () => {},
    },
  ];
};

export default listMenu;
