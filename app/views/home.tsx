import colors from '@/assets/styles/colors';
import Card from '@/components/atoms/card';
import CardMenu from '@/components/atoms/cardMenu';
import Dropdown from '@/components/atoms/dropdown';
import QuizCard from '@/components/molecules/quiz/quizCard';
import Authenticated from '@/components/layouts/authenticated';

import {QuizType} from '@/types/quiz';
import {getQuiz} from '@/services/quiz';
import listMenu from '@/app/routes/menuList';
import React, {useEffect, useState} from 'react';
import {navigate} from '@/app/routes/rootNavigation';
import {logout as clearSession} from '@/services/auth';
import {resetUser} from '@/state/user/slice/userSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAppDispatch, useAppSelector} from '@/hooks/redux';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AlertType, setAlert} from '@/state/alert/alertSlice';
const defaultImage = require('@/assets/images/default.png');

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [profilePicture, setProfilePicture] = useState<any>(defaultImage);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const {width, height} = Dimensions.get('window');

  const getData = async () => {
    setLoading(true);

    const result = await getQuiz(1);
    const data = result.body?.data ?? [];
    setQuiz(data.slice(0, 5));

    setLoading(false);
  };

  const logout = async () => {
    await clearSession();
    dispatch(resetUser());
  };

  const onProfileError = () => {
    const alert: AlertType = {
      status: 'failed',
      title: 'Profile picture error',
      message: 'Cannot set your profile picture. Try to change another picture',
    };

    setProfilePicture(defaultImage);
    dispatch(setAlert(alert));
  };

  useEffect(() => {
    getData();

    return () => {
      setQuiz([]);
    };
  }, []);

  return (
    <Authenticated loading={loading}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.sayText}>Hi! {user.name}</Text>
            <Text>Keep focus and always try</Text>
          </View>

          <Dropdown position="right">
            <Dropdown.Button>
              <Image
                source={profilePicture}
                onError={onProfileError}
                style={styles.profile}
                borderRadius={100}
                resizeMode={'contain'}
                defaultSource={defaultImage}
              />
              {/* <View style={styles.imageWrapper}></View> */}
            </Dropdown.Button>
            <Dropdown.Content>
              <Dropdown.Item style={styles.dropdownItem} onPress={logout}>
                <Ionicons name="log-out-outline" style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Logout</Text>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown>
        </View>

        <Card
          background={colors.primary}
          height={height * 0.25}
          style={styles.card}>
          <Text style={styles.cardText}>lets play and {'\n'}be the first!</Text>
          <Text style={styles.cardTextTotal}>Quiz you have done: 0</Text>
        </Card>

        {user.level == 'admin' && (
          <>
            <Text style={styles.menuText}>Menu list</Text>
            <View style={styles.menuList}>
              {listMenu()
                .slice(0, 4)
                .map((item, index) => (
                  <CardMenu
                    key={index}
                    size={item.size}
                    label={item.label}
                    onPress={item.onPress}
                    style={styles.menuItem}
                    backgroundColor={item.backgroundColor}>
                    <CardMenu.Icon iconName={item.iconName} />
                  </CardMenu>
                ))}
              <CardMenu
                label="Other menu"
                size={width * 0.155}
                style={styles.menuItem}
                backgroundColor={colors.blue}
                onPress={() => {}}>
                <CardMenu.Icon iconName="apps" />
              </CardMenu>
            </View>
          </>
        )}

        <Text style={styles.newestQuizText}>Latest quiz</Text>
        <View style={styles.quizListWrapper}>
          {quiz.map((item, index) => {
            return (
              <QuizCard
                key={index}
                quiz={item}
                hideAction={user.level != 'admin'}
                onPress={() => {
                  navigate('tabBar');
                }}
              />
            );
          })}
        </View>
      </ScrollView>
    </Authenticated>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  sayText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  profile: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
  },
  logoutIcon: {
    marginRight: 15,
    fontSize: 16,
    color: colors.red,
    textAlignVertical: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: colors.red,
    textAlignVertical: 'center',
  },
  dropdownItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  imageWrapper: {
    width: 50,
    height: 50,
    backgroundColor: colors.secondary,
    borderRadius: 100,
  },
  container: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardText: {
    fontSize: 25,
    color: 'white',
  },
  cardTextTotal: {
    color: 'white',
    fontSize: 16,
  },
  menuText: {
    marginLeft: 12,
    marginTop: 20,
    fontSize: 16,
  },
  menuList: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: Dimensions.get('window').width + 12,
  },
  menuItem: {
    marginTop: 12,
    marginLeft: 12,
  },
  newestQuizText: {
    fontSize: 16,
    marginLeft: 12,
    marginTop: 20,
    marginBottom: 10,
  },
  quizListWrapper: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
});

export default Home;
