import {Provider} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

import store from '@/state/store';
import Router from '@/app/routes/router';
import Offline from '@/views/errors/offline';
import RootStackParamList from '@/app/routes/typeChecking';
import {navigationRef} from '@/app/routes/rootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [network, setNetwork] = useState<NetInfoState>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setNetwork(state));

    return () => {
      unsubscribe();
    };
  }, [network?.isConnected]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator>
            {network != null && network.isConnected ? (
              <Stack.Screen
                name="router"
                component={Router}
                options={{headerShown: false}}
              />
            ) : (
              <Stack.Screen
                name="offline"
                component={Offline}
                options={{headerShown: false}}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
