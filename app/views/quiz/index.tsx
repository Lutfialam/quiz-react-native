import useDebounce from '@/hooks/useDebounce';
import Button from '@/components/atoms/button';
import Input from '@/components/atoms/forms/input';
import QuizCard from '@/components/molecules/quiz/quizCard';
import Authenticated from '@/components/layouts/authenticated';

import {QuizType} from '@/types/quiz';
import {useAppSelector} from '@/hooks/redux';
import React, {useEffect, useState} from 'react';
import {getQuiz as getQuizList} from '@/services/quiz';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

interface Quiz {}

const Quiz: React.FC<Quiz> = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadMoreProccess, setloadMoreProccess] = useState(false);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [page, setPage] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  const {user} = useAppSelector(state => state);
  const searchDebounce = useDebounce(search, 500);

  const quizData = async (currentPage: number) => {
    const result = await getQuizList(currentPage, searchDebounce);
    const data = result.body?.data ?? [];

    const lastPage = result.body?.last_page ?? 1;
    setPage({...page, currentPage, lastPage});

    return data;
  };

  const getData = async (currentPage: number) => {
    setLoading(true);
    setQuiz(await quizData(currentPage));
    setLoading(false);
  };

  const loadMore = async (currentPage: number) => {
    setloadMoreProccess(true);

    const data = await quizData(currentPage);
    setQuiz([...quiz, ...data]);

    setloadMoreProccess(false);
  };

  const onSearch = (name: string, value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    const dataIsEmpty = quiz.length <= 0 || searchDebounce != '';
    dataIsEmpty ? getData(page.currentPage) : setQuiz(quiz);

    return () => {
      setPage({currentPage: 1, lastPage: 1});
      setQuiz([]);
    };
  }, [searchDebounce]);

  return (
    <Authenticated loading={loading}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.quizContainer}>
        <Text>Quiz list</Text>
        <Input
          name="search"
          value={search}
          borderLess={true}
          placeholder="Search quiz"
          style={{marginVertical: 10}}
          onInputChange={onSearch}
        />

        {quiz.map((item, index) => (
          <QuizCard
            key={index}
            quiz={item}
            hideAction={user.level != 'admin'}
          />
        ))}

        {loadMoreProccess ? (
          <View style={styles.loadMoreLoadingContainer}>
            <Image source={require('@/assets/images/loading.gif')} />
          </View>
        ) : (
          <Button
            rounded
            title="Load more"
            style={styles.loadMoreButton}
            isHide={page.currentPage == page.lastPage}
            onPress={() => {
              loadMore(page.currentPage + 1);
            }}
          />
        )}
      </ScrollView>
    </Authenticated>
  );
};

const styles = StyleSheet.create({
  quizContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadMoreButton: {
    marginVertical: 15,
    alignSelf: 'center',
  },
  loadMoreLoadingContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
});

export default Quiz;
