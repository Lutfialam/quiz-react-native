import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import colors from '@/assets/styles/colors';
import QuizCard from '@/components/molecules/quiz/quizCard';
import Authenticated from '@/components/layouts/authenticated';

import {QuizType} from '@/types/quiz';
import {HistoryType} from '@/types/history';
import {AlertType, setAlert} from '@/state/alert/alertSlice';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {getHistory as getHistoryList} from '@/services/history';

import VectorImage from 'react-native-vector-image';
const undrawEmpty = require('@/assets/images/undraw_empty.svg');
const defaultImage = require('@/assets/images/default.png');

interface Profile {}

const Profile: React.FC<Profile> = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [profilePicture, setProfilePicture] = useState<any>(defaultImage);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const onProfileError = () => {
    const alert: AlertType = {
      status: 'failed',
      title: 'Profile picture error',
      message: 'Cannot set your profile picture. Try to change another picture',
    };

    setProfilePicture(defaultImage);
    dispatch(setAlert(alert));
  };

  const getHistory = async () => {
    setLoading(true);

    const result = await getHistoryList();
    setHistory([]);

    setLoading(false);
  };

  useEffect(() => {
    getHistory();
    setProfilePicture({uri: user.image});

    return () => {
      setHistory([]);
      setProfilePicture(defaultImage);
    };
  }, [user]);

  return (
    <Authenticated loading={loading} containerStyle={styles.layout}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        <View style={styles.credentialContainer}>
          <Image
            source={profilePicture}
            onError={onProfileError}
            style={styles.profile}
            borderRadius={100}
            resizeMode={'contain'}
            defaultSource={defaultImage}
          />

          <View style={styles.credential}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyHeader}>Your history</Text>

          {history.length > 0 ? (
            history.map((item, index) => (
              <QuizCard
                key={index}
                hideAction={true}
                quiz={item.quiz as QuizType}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.historyEmptyContainer}>
              <VectorImage
                source={undrawEmpty}
                resizeMode="contain"
                style={styles.historyEmptyImage}
              />

              <Text style={styles.historyEmptyText}>
                Your history is empty. try finish some quiz and your history
                will show in this section
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Authenticated>
  );
};

const {height, width} = Dimensions.get('screen');
const {height: windowHeight, width: windowWidth} = Dimensions.get('window');

const styles = StyleSheet.create({
  layout: {
    padding: 0,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: height,
  },
  credentialContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  credential: {
    width: windowWidth,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    color: 'white',
  },
  email: {
    fontSize: 18,
    color: 'white',
  },
  profile: {
    marginLeft: 10,
    marginRight: 30,
    backgroundColor: 'white',
    width: windowWidth * 0.24,
    height: windowWidth * 0.24,
  },
  historyContainer: {
    marginVertical: 20,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  historyHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyEmptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  historyEmptyImage: {
    width: Dimensions.get('screen').width * 0.8,
    height: Dimensions.get('screen').height * 0.5,
  },
  historyEmptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Profile;
