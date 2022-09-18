import React from 'react';
import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import VectorImage from 'react-native-vector-image';
const undrawOffline = require('@/assets/images/undraw_offline_connection.svg');

interface Offline {}

const Offline: React.FC<Offline> = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <VectorImage
        source={undrawOffline}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.text}>Connection error</Text>
      <Text style={styles.textDescription}>
        You are Offline please connect to internet to continue
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.5,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  textDescription: {
    marginTop: 4,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Offline;
