import {UserType} from '@/types/user';
import Response, {ResponseError} from '@/models/Response';
import instance from '@/services/instance';
import ResponseType from '@/types/response';
import EncryptedStorage from 'react-native-encrypted-storage';
import DeviceInfo from 'react-native-device-info';

export const login = async (user: UserType) => {
  let data: ResponseType<any> = {};

  await instance.get(`/sanctum/csrf-cookie`).then(async res => {
    await instance
      .post('/api/auth/login', {
        ...user,
        type: 'mobile',
        device_name: DeviceInfo.getDeviceId(),
      })
      .then(response => (data = new Response(response)))
      .catch(error => (data.errors = new ResponseError(error)));

    if (data.body?.accessToken) {
      EncryptedStorage.setItem('token', data.body.accessToken);
    }
  });

  return data;
};

export const register = async (user: UserType) => {
  let data: ResponseType<UserType> = {};
  const form = new FormData();

  form.append('name', user.name ?? '');
  form.append('email', user.email ?? '');
  form.append('password', user.password ?? '');
  form.append('password_confirmation', user.passwordConfirmation ?? '');
  if (user.image) form.append('image', user.image);

  await instance
    .post('/api/auth/register', form)
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const getUser = async (signal: AbortSignal) => {
  let data: ResponseType<UserType> = {};

  await instance
    .get(`/api/auth/user`, {signal})
    .then(response => (data = new Response(response)))
    .catch(error => (data.errors = new ResponseError(error)));

  return data;
};

export const logout = async () => {
  await instance.get('/api/auth/logout');
  EncryptedStorage.removeItem('token');
};
