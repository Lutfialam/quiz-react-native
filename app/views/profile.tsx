import React, {useEffect} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Authenticated from '@/components/layouts/authenticated';
import {useAppSelector} from '../hooks/redux';
const defaultImage = require('@/assets/images/default.png');

interface Profile {}

const Profile: React.FC<Profile> = () => {
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    return () => {};
  }, [user]);

  return (
    <Authenticated>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.credentialContainer}>
        <Image
          source={
            user.image && user.image?.length > 0
              ? {uri: user.image}
              : defaultImage
          }
          style={styles.profile}
          borderRadius={100}
          resizeMode={'contain'}
          defaultSource={defaultImage}
        />

        <View style={styles.credential}>
          <Text style={styles.name}>Lutfi Alamsyah</Text>
        </View>
      </ScrollView>
    </Authenticated>
  );
};

const styles = StyleSheet.create({
  credentialContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  credential: {
    width: Dimensions.get('window').width,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  name: {
    textAlignVertical: 'center',
    fontSize: 24,
  },
  profile: {
    backgroundColor: 'black',
    width: Dimensions.get('window').width * 0.24,
    height: Dimensions.get('window').width * 0.24,
  },
});

export default Profile;
