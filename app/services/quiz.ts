import Quiz from '@/models/Quiz';
import instance from '@/services/instance';
import ResponseType from '@/types/response';
import {QuizType, QuizTypePagination} from '@/types/quiz';
import Response, {ResponseError} from '@/models/Response';

export const getQuiz = async (page?: number, search?: string) => {
  const s = search && search.length > 0 ? `&search=${search}` : '';
  const url = `/api/quiz?page=${page ?? 1}${s}`;

  let data: ResponseType<QuizTypePagination> = {};

  await instance
    .get(url)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getSearchableQuiz = async (search: string, page?: number) => {
  let data: ResponseType<QuizTypePagination> = {};
  const url = `/api/quiz?page=${page ?? 1}&search=${search}`;

  await instance
    .get(url)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getQuizById = async (id: number) => {
  let data: ResponseType<QuizType> = {};

  await instance
    .get(`/api/quiz/${id}`)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getHiddenAnswerQuizList = async (page?: number) => {
  let data: ResponseType<QuizTypePagination> = {};
  const url = '/api/quiz-list-hidden-answer';

  await instance
    .get(`${url}?page=${page ?? 1}`)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getHiddenAnswerQuiz = async (quiz_id: number) => {
  let data: ResponseType<QuizType> = {};
  const url = '/api/quiz-hidden-answer?quiz_id=' + quiz_id;

  await instance
    .get(url)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const addQuiz = async (item: QuizType) => {
  const quiz = new Quiz();
  const form = quiz.toFormData(item);

  let data: ResponseType<QuizType> = {};
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  // instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  await instance
    .post('/api/quiz', form, config)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const updateQuiz = async (item: Quiz, deleted: number[]) => {
  const quiz = new Quiz();
  const form = quiz.toFormData(item);

  form.append('_method', 'PUT');
  form.append('deleted_question', JSON.stringify(deleted));

  let data: ResponseType<QuizType> = {};
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  // instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  await instance
    .post(`/api/quiz/${quiz.id}`, form, config)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const deleteQuiz = async (quiz_id: number) => {
  let data: ResponseType<QuizType> = {};

  await instance
    .delete('/api/quiz/' + quiz_id)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};
