import colors from '@/assets/styles/colors';
import React, {useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ViewStyle,
  StyleProp,
  Image,
} from 'react-native';
import {resetAlert} from '@/state/alert/alertSlice';

interface Authenticated {
  loading?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const Authenticated: React.FC<Authenticated> = props => {
  const {loading, containerStyle, children} = props;

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
      duration: 500,
      useNativeDriver: false,
      toValue: alert.message != '' ? 1 : 0,
    }).start();

    const timeout = setTimeout(closeAlert, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, [user, alert]);

  return (
    <SafeAreaView>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image source={require('@/assets/images/loading.gif')} />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      ) : (
        <View style={[styles.container, containerStyle]}>{children}</View>
      )}
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

const defaultStyles = (alertStatus: string) => {
  const alertBackground = () => {
    if (alertStatus == 'failed') return colors.red;
    if (alertStatus == 'success') return colors.green;

    return colors.primary;
  };

  return StyleSheet.create({
    container: {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
    },
    loadingContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 30,
      fontSize: 18,
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

export default Authenticated;
