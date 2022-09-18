import React, {useEffect, useState} from 'react';
import Quiz from '@/views/quiz';
import Home from '@/views/home';
import colors from '@/styles/colors';
import Profile from '@/views/profile';

import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {Dimensions, Text} from 'react-native';
import {setTab} from '@/state/tab/tabSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '@/app/hooks/redux';

const tabBarOption = (
  icon: string,
  screen: string,
): BottomTabNavigationOptions => {
  const {primary, secondary} = colors;

  return {
    tabBarLabelPosition: 'beside-icon',
    tabBarLabel: ({focused}) => {
      const color = focused ? primary : secondary;
      return focused ? (
        <Text style={{color, paddingLeft: 20}}>{screen}</Text>
      ) : null;
    },
    headerShown: false,
    tabBarIcon: ({focused, size}) => {
      const iconName = focused ? icon : `${icon}-outline`;
      const iconColor = focused ? primary : secondary;

      return <Ionicons name={iconName} size={size} color={iconColor} />;
    },
  };
};

const TabBar = () => {
  const dispatch = useAppDispatch();
  const Tab = createBottomTabNavigator();
  const [screen, setScreen] = useState('');

  const {currentScreen} = useAppSelector(state => state.tabScreen);
  useEffect(() => {}, [currentScreen]);
  console.log('====================================');
  console.log(screen);
  console.log('====================================');

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      initialRouteName={'home'}
      screenListeners={{
        state: event => {
          const {routeNames, index} = (event.data as any).state;
          dispatch(setTab({currentScreen: routeNames[index]}));
          setScreen(routeNames[index]);
        },
      }}>
      <Tab.Screen
        name="home"
        component={Home}
        options={tabBarOption('home', 'home')}
      />
      <Tab.Screen
        name="quiz"
        component={Quiz}
        options={tabBarOption('document-text', 'quiz')}
      />
      <Tab.Screen
        name="profile"
        component={Profile}
        options={tabBarOption('person-circle', 'profile')}
      />
    </Tab.Navigator>
  );
};

const screenOptions: BottomTabNavigationOptions = {
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    margin: 8,
    height: Dimensions.get('screen').height * 0.08,
    borderRadius: 12,
  },
  tabBarItemStyle: {
    margin: 10,
  },
};

export default TabBar;
