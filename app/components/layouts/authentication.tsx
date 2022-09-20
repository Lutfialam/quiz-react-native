import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '@/assets/styles/colors';
import React, {useEffect, useRef} from 'react';
import {resetAlert} from '@/state/alert/alertSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';

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
  const {user, alert} = useAppSelector(state => state);
  const styles = defaultStyles(alert.status);

  const closeAlert = () => {
    Animated.timing(notification, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) dispatch(resetAlert());
    });
  };

  useEffect(() => {
    Animated.timing(notification, {
      toValue: alert.message != '' ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();

    const timeout = setTimeout(closeAlert, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [user, alert]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
      {/* {loading && (

      )} */}
      {alert.message != '' && (
        <Animated.View style={[styles.alertContainer, {opacity: notification}]}>
          <View style={styles.alert}>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
          <Ionicons
            name="close-circle-outline"
            style={styles.closeButton}
            onPress={closeAlert}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const Card: React.FC<Card> = ({children}) => {
  return (
    <>
      <Text style={cardStyle.logo}>QUIZ APP</Text>
      <View style={cardStyle.cardStyle}>{children}</View>
    </>
  );
};

const defaultStyles = (alertStatus: string) => {
  const alertBackground = () => {
    if (alertStatus == 'failed') return colors.red;
    if (alertStatus == 'success') return colors.green;

    return colors.primary;
  };

  return StyleSheet.create({
    container: {
      display: 'flex',
      width: '100%',
      minHeight: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    alertContainer: {
      bottom: 0,
      margin: 15,
      padding: 15,
      borderRadius: 15,
      position: 'absolute',
      width: Dimensions.get('window').width - 30,
      backgroundColor: alertBackground(),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    alert: {
      display: 'flex',
      flexDirection: 'column',
    },
    alertMessage: {
      color: 'white',
    },
    closeButton: {
      color: 'white',
      fontSize: 20,
    },
  });
};

const cardStyle = StyleSheet.create({
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
});

Authentication.Card = Card;
export default Authentication;
