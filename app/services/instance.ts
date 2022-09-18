import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import {API_URL} from '@env';

const instance = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async config => {
  const token = (await EncryptedStorage.getItem('token')) ?? 'failed_token';

  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

instance.interceptors.response.use(
  async response => {
    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
    // return error;
  },
);

export default instance;
