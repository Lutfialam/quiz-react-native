import colors from '@/styles/colors';
import React, {useEffect, useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '@/app/hooks/redux';
import {resetServerStatus} from '@/state/statusServer/statusServerSlice';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';

interface Authenticated {
  loading?: boolean;
  children: React.ReactNode;
}

const Authenticated: React.FC<Authenticated> = props => {
  const {loading, children} = props;

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
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
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

// const { } = Dimensions.get('screen');
const styles = StyleSheet.create({
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

export default Authenticated;
