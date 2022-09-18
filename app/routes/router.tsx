import React, {useEffect, useState} from 'react';
import RootStackParamList from '@/app/routes/typeChecking';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import TabBar from '@/app/routes/tabBar';

import colors from '@/styles/colors';
import Login from '@/views/auth/login';
import QuizEdit from '@/views/quiz/edit';
import Register from '@/views/auth/register';
import QuizCreate from '@/views/quiz/create';
import QuizEntries from '@/views/quiz/entries';

import {getUser} from '@/services/auth';
import {setUser} from '@/state/user/slice/userSlice';
import {useAppDispatch, useAppSelector} from '../hooks/redux';
import {setServerStatus} from '@/state/statusServer/statusServerSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const childOpion = (title: string): NativeStackNavigationOptions => {
  return {
    headerTitle: title,
    headerTintColor: 'white',
    headerTitleStyle: {color: 'white'},
    headerStyle: {backgroundColor: colors.primary},
  };
};

const Router = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUser = async (signal: AbortSignal) => {
    const result = await getUser(signal);

    if (result.body) {
      dispatch(setUser(result.body));
      setIsLoggedIn(true);
    } else if (result.errors?.code == 401) {
      setIsLoggedIn(false);
    } else {
      dispatch(
        setServerStatus({
          code: 500,
          status: 'failed',
          message: 'Something went wrong',
        }),
      );
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (user && user.email == '') checkUser(controller.signal);
    if (user && user.email != '') setIsLoggedIn(true);

    return () => {
      controller.abort();
      setIsLoggedIn(false);
    };
  }, [user]);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen
            name="tabBar"
            component={TabBar}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="quiz_entries"
            component={QuizEntries}
            options={childOpion('Quiz list')}
          />
          <Stack.Screen
            name="quiz_create"
            component={QuizCreate}
            options={childOpion('Create new quiz')}
          />
          <Stack.Screen name="quiz_edit" component={QuizEdit} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="register"
            component={Register}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default Router;
