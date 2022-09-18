import Response, {ResponseError} from '@/models/Response';
import {CategoryType, PaginationCategory} from '@/types/category';
import instance from './instance';

export const getCategory = async (
  signal: AbortSignal,
  page?: number,
  search?: string,
) => {
  let data: Response<PaginationCategory> = {};

  const url =
    search && search.length > 0
      ? `/api/category?page=${page ?? 1}&search=${search}`
      : `/api/category?page=${page ?? 1}`;

  await instance
    .get(url, {signal})
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getCategoryById = async (id: number) => {
  const {data} = await instance.get(`/api/category/${id}`);
  return data;
};

export const createCategory = async (category: CategoryType) => {
  let data: Response<CategoryType> = {};

  await instance
    .post('/api/category', category)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const updateCategory = async (category: CategoryType) => {
  let data: Response<CategoryType> = {};

  await instance
    .put(`/api/category/${category.id}`, category)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const deleteCategory = async (id: number) => {
  let data: Response<CategoryType> = {};

  await instance
    .delete(`/api/category/${id}`)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};
