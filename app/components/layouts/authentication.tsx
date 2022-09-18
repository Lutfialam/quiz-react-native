import {useAppDispatch, useAppSelector} from '@/app/hooks/redux';
import {resetServerStatus} from '@/state/statusServer/statusServerSlice';
import colors from '@/styles/colors';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Authentication {
  loading?: boolean;
  children: React.ReactNode;
}

interface Card {
  children: React.ReactNode;
}

type AuthenticationType = React.FunctionComponent<Authentication> & {
  Card: React.FC<Card>;
};

const Authentication: AuthenticationType = ({loading, children}) => {
  const dispatch = useAppDispatch();
  const notification = useRef(new Animated.Value(0)).current;
  const {user, serverStatus} = useAppSelector(state => state);

  const closeNotification = () => {
    Animated.timing(notification, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) dispatch(resetServerStatus());
    });
  };

  useEffect(() => {
    Animated.timing(notification, {
      toValue: serverStatus.message != '' ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [user, serverStatus]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
      {serverStatus.message != '' && (
        <Animated.View
          style={[styles.errorNotificationContainer, {opacity: notification}]}>
          <View style={styles.errorNotification}>
            <Text style={styles.errorText}>{serverStatus.message}</Text>
          </View>
          <Ionicons
            name="close-circle-outline"
            style={styles.closeButton}
            onPress={closeNotification}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const Card: React.FC<Card> = ({children}) => {
  return (
    <>
      <Text style={styles.logo}>QUIZ APP</Text>
      <View style={styles.cardStyle}>{children}</View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  cardStyle: {
    width: '100%',
    minHeight: '40%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  errorNotificationContainer: {
    bottom: 0,
    margin: 15,
    padding: 15,
    borderRadius: 15,
    position: 'absolute',
    width: Dimensions.get('window').width - 30,
    backgroundColor: colors.red,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorNotification: {
    display: 'flex',
    flexDirection: 'column',
  },
  errorText: {
    color: 'white',
  },
  closeButton: {
    color: 'white',
    fontSize: 20,
  },
});

Authentication.Card = Card;
export default Authentication;
