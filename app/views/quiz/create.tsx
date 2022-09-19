import colors from '@/styles/colors';
import {QuizType} from '@/types/quiz';
import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import Button from '@/components/atoms/button';
import Divider from '@/components/atoms/divider';
import Input from '@/components/atoms/forms/input';
import Authenticated from '@/components/layouts/authenticated';

import useDebounce from '@/app/hooks/useDebounce';
import {addQuiz} from '@/services/quiz';
import {getCategory} from '@/services/category';
import {navigate} from '@/app/routes/rootNavigation';
import SelectSearch, {
  SelectSearchValue,
} from '@/components/atoms/forms/selectSearch';
import {ResponseError} from '@/models/Response';
import {useAppDispatch} from '@/app/hooks/redux';
import {AlertType, setAlert} from '@/state/alert/alertSlice';

interface Create {}

const Create: React.FC<Create> = () => {
  const [quiz, setQuiz] = useState<QuizType>({} as QuizType);
  const [buttonAddVisible, setButtonAddVisible] = useState(false);
  const [buttonAddPosition, setbuttonAddPosition] = useState<number>();

  const [categoryPage, setCategoryPage] = useState(1);
  const [searchCategory, setSearchCategory] = useState('');
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [category, setCategory] = useState<SelectSearchValue[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectSearchValue>();

  const dispatch = useAppDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchCategoryDebounce = useDebounce(searchCategory, 500);

  const onInputChange = (name: string, value: string | number) => {
    setQuiz({...quiz, [name]: value});
  };

  const onQuestionChange = (name: string, value: string) => {
    const index = parseInt(name.split('-')[1]);

    const newQuestion = quiz.questions?.map(item => {
      if (item.index == index) {
        return {...item, [name.split('-')[0]]: value};
      }
      return item;
    });

    setQuiz({...quiz, questions: newQuestion});
  };

  const fetchCategory = async (signal: AbortSignal) => {
    setLoadingCategory(true);
    let newCategory: SelectSearchValue[] = [];

    const result = await getCategory(
      signal,
      categoryPage,
      searchCategoryDebounce,
    );

    result.body?.data?.map((item, index) => {
      newCategory.push({
        id: item.id ?? index,
        value: item.name ?? '',
      });
    });

    setCategory(newCategory);
    setSelectedCategory(selectedCategory ?? newCategory[0]);
    setLoadingCategory(false);
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...(quiz.questions ?? []),
        {
          index: quiz.questions?.length ?? 0,
          question: '',
          first_choice: '',
          second_choice: '',
          third_choice: '',
          fourth_choice: '',
          answer: 'A',
          errors: {},
        },
      ],
    });
  };

  const valueIsEmpty = (value?: string | number): boolean => {
    if (value && typeof value == 'string' && value.length > 0) {
      return false;
    } else if (value && typeof value == 'number' && value > 0) {
      return false;
    }
    return true;
  };

  const onSearch = (text: string) => {
    const filtered = category.filter(({value}) => {
      if (value.toLowerCase().includes(text.toLowerCase()) || text == '') {
        return true;
      }
      return false;
    });

    if (filtered.length <= 0) setSearchCategory(text);
    setCategory(filtered);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;

    let opacity = 1;
    const contentHeight = contentSize.height - 20;
    const offset = layoutMeasurement.height + contentOffset.y;

    if (
      offset >= contentHeight ||
      (buttonAddPosition && contentOffset.y < buttonAddPosition)
    ) {
      opacity = 0;
      setButtonAddVisible(false);
    } else {
      opacity = 1;
      setButtonAddVisible(true);
    }

    Animated.timing(fadeAnim, {
      toValue: opacity,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const isValidated = () => {
    let isValid = true;
    const quizList = ['name', 'description', 'category_id', 'time'] as const;
    const questionFieldList = [
      'question',
      'first_choice',
      'second_choice',
      'third_choice',
      'fourth_choice',
    ] as const;

    let quizError = {};
    quizList.map(item => {
      if (valueIsEmpty(quiz[item])) {
        isValid = false;
        const name = item.split('_');
        quizError = {...quizError, [item]: `${name[0]} is required`};
      }
    });

    const newQuestion = quiz.questions?.map(item => {
      questionFieldList.map(field => {
        if (valueIsEmpty(item[field])) {
          isValid = false;
          item.errors = {
            ...item.errors,
            [field]: `${field.split('_').join(' ')} is required`,
          };
        }
      });
      return item;
    });
    setQuiz({...quiz, errors: quizError, questions: newQuestion});

    return isValid;
  };

  const setError = (errors: ResponseError) => {
    if (typeof errors.data == 'string') {
      const alert: AlertType = {
        title: 'Error',
        status: 'failed',
        message: errors.data,
      };

      dispatch(setAlert(alert));
    } else {
      setQuiz({...quiz, errors: {...(errors?.data?.errors ?? {})}});
    }
  };

  const submit = async () => {
    if (isValidated()) {
      const result = await addQuiz(quiz);

      if (result.status == 'success') {
        const alert: AlertType = {
          title: 'Success',
          status: 'success',
          message: 'Quiz is successfully added',
        };

        dispatch(setAlert(alert));
        navigate('quiz_entries');
      }
      if (result.errors) setError(result.errors as ResponseError);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCategory(controller.signal);
    (quiz.questions?.length ?? 0) <= 0 ? addQuestion() : setQuiz(quiz);

    setLoadingCategory(false);

    return () => {
      setQuiz({});
      controller.abort();
    };
  }, [searchCategoryDebounce]);

  return (
    <Authenticated>
      <ScrollView showsVerticalScrollIndicator={false} onScroll={onScroll}>
        <Text style={styles.headerLine}>Create new quiz</Text>

        <Input
          label="Name"
          name="name"
          value={quiz.name}
          containerStyle={styles.containerInput}
          error={quiz.errors?.name}
          onInputChange={onInputChange}
        />
        <Input
          label="Time"
          name="time"
          keyboardType="numeric"
          value={quiz.time?.toString()}
          containerStyle={styles.containerInput}
          error={quiz.errors?.time}
          onInputChange={onInputChange}
        />
        <SelectSearch
          label="Category"
          data={category}
          selected={selectedCategory}
          isLoading={loadingCategory}
          containerStyle={styles.containerInput}
          error={quiz.errors?.category_id}
          onChangeText={onSearch}
          onSelected={item => {
            onInputChange('category_id', item.id);
          }}
        />
        <Input
          label="Description"
          name="description"
          numberOfLines={4}
          value={quiz.description?.toString()}
          style={{textAlignVertical: 'top'}}
          containerStyle={styles.containerInput}
          error={quiz.errors?.description}
          onInputChange={onInputChange}
        />

        <View
          style={styles.questionHeadLine}
          onLayout={({
            nativeEvent: {
              layout: {y},
            },
          }) => {
            setbuttonAddPosition(y);
          }}>
          <Text style={styles.questionHeadLineText}>Questions</Text>
          <TouchableOpacity
            style={styles.buttonAddQuestion}
            onPress={addQuestion}>
            <Text style={styles.buttonAddText}>Add question</Text>
          </TouchableOpacity>
        </View>
        <Divider color={colors.primary} />

        {quiz.questions?.map((item, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Questions {index}</Text>
            <Input
              label="Question"
              name={`question-${item.index}`}
              value={item.question}
              error={item.errors?.question}
              containerStyle={styles.questions}
              onInputChange={onQuestionChange}
            />
            <Input
              label="First choice (A)"
              name={`first_choice-${item.index}`}
              value={item.first_choice}
              error={item.errors?.first_choice}
              containerStyle={styles.questions}
              onInputChange={onQuestionChange}
            />
            <Input
              label="Second choice (B)"
              name={`second_choice-${item.index}`}
              value={item.second_choice}
              error={item.errors?.second_choice}
              containerStyle={styles.questions}
              onInputChange={onQuestionChange}
            />
            <Input
              label="Third choice (C)"
              name={`third_choice-${item.index}`}
              value={item.third_choice}
              error={item.errors?.third_choice}
              containerStyle={styles.questions}
              onInputChange={onQuestionChange}
            />
            <Input
              label="Fourth choice (D)"
              name={`fourth_choice-${item.index}`}
              value={item.fourth_choice}
              error={item.errors?.fourth_choice}
              containerStyle={styles.questions}
              onInputChange={onQuestionChange}
            />
            {quiz.questions?.length != index + 1 && (
              <Divider color={colors.primary} />
            )}
          </View>
        ))}

        <Button
          rounded
          title="Submit data"
          onPress={submit}
          style={styles.buttonSubmit}
        />
      </ScrollView>
      <Animated.View style={{opacity: fadeAnim}}>
        <TouchableOpacity
          disabled={!buttonAddVisible}
          style={styles.buttonAdd}
          onPress={addQuestion}>
          <Text style={styles.buttonAddText}>Add question</Text>
        </TouchableOpacity>
      </Animated.View>
    </Authenticated>
  );
};

const styles = StyleSheet.create({
  headerLine: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  containerInput: {
    marginVertical: 5,
  },
  questionHeadLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  questionHeadLineText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonAddQuestion: {
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  questionContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questions: {
    marginVertical: 5,
  },
  buttonSubmit: {
    width: '100%',
    marginBottom: 10,
  },
  buttonAdd: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  buttonAddText: {
    marginVertical: 8,
    marginHorizontal: 14,
    fontSize: 14,
    color: 'white',
  },
});

export default Create;
