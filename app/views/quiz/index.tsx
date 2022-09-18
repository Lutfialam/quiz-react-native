import QuizCard from '@/components/molecules/quiz/quizCard';
import Authenticated from '@/components/layouts/authenticated';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {QuizType} from '@/types/quiz';
import Input from '@/components/atoms/forms/input';
import {getQuiz as getQuizList} from '@/services/quiz';
import Button from '@/components/atoms/button';
import useDebounce from '@/app/hooks/useDebounce';

interface Quiz {}

const Quiz: React.FC<Quiz> = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMoreProccess, setloadMoreProccess] = useState(false);
  const [quiz, setQuiz] = useState<QuizType[]>([]);
  const [page, setPage] = useState({
    currentPage: 1,
    lastPage: 1,
  });

  const searchDebounce = useDebounce(search, 500);

  const getQuiz = async (currentPage: number) => {
    const result = await getQuizList(currentPage, searchDebounce);

    const data = result.body?.data ?? [];
    const lastPage = result.body?.last_page ?? 1;
    const newQuiz =
      quiz.length > 0 && search.length <= 0 ? [...quiz, ...data] : data;

    setQuiz(newQuiz);
    setPage({...page, currentPage, lastPage});
    return data;
  };

  // const loadMore = async (currentPage: number) => {
  //   setloadMoreProccess(true)

  //   const newQuiz = await getQuiz(currentPage);
  //   setQuiz([...quiz, ...newQuiz]);

  //   setloadMoreProccess(false)
  // }

  const onSearch = (name: string, value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    if (quiz.length <= 0 || searchDebounce != '') {
      setLoading(true);
      getQuiz(page.currentPage);
      setLoading(false);
    } else {
      setQuiz(quiz);
    }

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
          <QuizCard key={index} quiz={item} />
        ))}

        <Button
          rounded
          title="Load more"
          style={styles.loadMoreButton}
          isHide={page.currentPage == page.lastPage}
          onPress={() => {
            getQuiz(page.currentPage + 1);
          }}
        />
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
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default Quiz;
