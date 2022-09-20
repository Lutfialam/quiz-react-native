import {HistoryType, HistoryTypePagination} from '@/types/history';
import ResponseType from '@/types/response';
import instance from '@/services/instance';
import Response, {ResponseError} from '@/models/Response';

export const getHistory = async () => {
  let data: ResponseType<HistoryTypePagination> = {};

  await instance
    .get(`/api/history`)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getHistoryResult = async (id: number) => {
  let data: ResponseType<HistoryType> = {};

  await instance
    .get(`/api/history/${id}`)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const addHistory = async (history: HistoryType) => {
  let data: ResponseType<any> = {};

  await instance
    .post('/api/history', history)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};
