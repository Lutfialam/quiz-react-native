import React from 'react';
import colors from '@/assets/styles/colors';
import {QuizType} from '@/types/quiz';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Dropdown from '@/components/atoms/dropdown';

interface QuizCard {
  width?: number;
  height?: number;
  hideAction?: boolean;
  background?: string;
  onPress?: () => void;
  quiz: QuizType;
}

const QuizCard: React.FC<QuizCard> = props => {
  const {width, height, hideAction, background, onPress, quiz} = props;
  const styles = quizCardStyle(background, width, height);

  const name = quiz.name?.split(' ') ?? '';
  const secondInitial = name.length > 1 ? name[1].charAt(0) : name[0].charAt(1);
  const initial = `${name[0].charAt(0)}${secondInitial}`;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.initialQuizText}>{initial}</Text>
        <View style={styles.cardContent}>
          <Text style={styles.quizName}>{quiz.name}</Text>
          <Text>Time: {quiz.time}</Text>
        </View>
      </View>
      {!hideAction ? (
        <Dropdown position="right">
          <Dropdown.Button>
            <IonIcons
              name="ellipsis-vertical"
              style={styles.action}
              size={20}
            />
          </Dropdown.Button>
          <Dropdown.Content style={styles.dropdownContent}>
            <Dropdown.Item>Detail</Dropdown.Item>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      ) : null}
    </TouchableOpacity>
  );
};

const quizCardStyle = (
  background?: string,
  width?: number,
  height?: number,
) => {
  return StyleSheet.create({
    container: {
      width,
      height: height ?? 75,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      margin: 4,
      borderRadius: 15,
      zIndex: 20,
      backgroundColor: background ?? 'white',
    },
    content: {
      display: 'flex',
      flexDirection: 'row',
    },
    action: {
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    initialQuizText: {
      margin: 2,
      width: 50,
      height: 50,
      fontSize: 18,
      borderRadius: 10,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      textTransform: 'uppercase',
      textAlignVertical: 'center',
      backgroundColor: colors.primary,
    },
    cardContent: {
      marginLeft: 10,
      display: 'flex',
      flexDirection: 'column',
    },
    quizName: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    dropdownContent: {
      // marginHorizontal: 100,
      width: '50%',
    },
  });
};

export default QuizCard;
